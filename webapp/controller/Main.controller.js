sap.ui.define([
    "./BaseController",
    "../model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (
    BaseController,
    formatter,
    JSONModel,
    Filter,
    FilterOperator
) {
    "use strict";

    return BaseController.extend(
        "com.auritas.dataassist.controller.Main",
        {

            formatter: formatter,

            onInit: function () {

                const oJobsModel = new JSONModel();

                oJobsModel.loadData("model/jobs.json");

                oJobsModel.attachRequestCompleted(() => {

                    const aJobs = oJobsModel.getData();

                    const aFailedJobs =
                        aJobs.filter(job => job.status === "failed");

                    const aBlockedJobs =
                        aJobs.filter(job => job.status === "blocked");

                    const fSpaceReclaimed =
                        aJobs.reduce(
                            (sum, job) =>
                                sum + (job.metrics?.db_space_reclaimed_gb || 0),
                            0
                        );

                    const fMonthlySavings =
                        aJobs.reduce(
                            (sum, job) =>
                                sum + (job.metrics?.est_monthly_storage_saving_usd || 0),
                            0
                        );

                    const aConflicts = [];

                    for (let i = 0; i < aJobs.length; i++) {

                        for (let j = i + 1; j < aJobs.length; j++) {

                            const job1 = aJobs[i];
                            const job2 = aJobs[j];

                            if (
                                job1.archiving_object === job2.archiving_object &&
                                job1.schedule &&
                                job2.schedule
                            ) {

                                const start1 = job1.schedule.window_start;
                                const end1 = job1.schedule.window_end;

                                const start2 = job2.schedule.window_start;
                                const end2 = job2.schedule.window_end;

                                if (
                                    start1 < end2 &&
                                    start2 < end1
                                ) {

                                    aConflicts.push({
                                        job1: job1.name,
                                        job2: job2.name
                                    });

                                }
                            }
                        }
                    }

                    this.getView().setModel(
                        new JSONModel({
                            totalJobs: aJobs.length,
                            failedJobs: aFailedJobs.length,
                            blockedJobs: aBlockedJobs.length,
                            conflicts: aConflicts.length,
                            reclaimedSpace: fSpaceReclaimed.toFixed(1),
                            monthlySavings: fMonthlySavings
                        }),
                        "dashboard"
                    );

                    this.getView().setModel(
                        new JSONModel({
                            jobs: aJobs,
                            failedJobs: aFailedJobs,
                            blockedJobs: aBlockedJobs,
                            conflicts: aConflicts
                        }),
                        "jobs"
                    );

                });

            },

            onSearch: function (oEvent) {

                const sValue =
                    oEvent.getParameter("newValue");

                const oTable =
                    this.byId("jobsTable");

                const oBinding =
                    oTable.getBinding("items");

                if (!sValue) {
                    oBinding.filter([]);
                    return;
                }

                oBinding.filter([
                    new Filter(
                        "name",
                        FilterOperator.Contains,
                        sValue
                    )
                ]);

            }

        }
    );

});
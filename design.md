# Design Notes

## End User- SAP BTP Admin

The primary user for this application is an SAP Basis Administrator who will be responsible for monitoring archiving activities across SAP systems.

When designing the dashboard, I focused on the questions an administrator would typically ask during daily monitoring activities:

- Are any archiving jobs failing?
- Are any jobs blocked because of dependencies?
- Are there scheduling conflicts that need attention?
- How much database space has been reclaimed?
- What business value is being generated through archiving?

For this reason, I chose to display KPI information first, followed by operational issues requiring attention, and finally the detailed job list.

---

## Key Design Decisions

### KPI-First Layout

I chose to place KPI cards at the top of the dashboard because administrators usually want a quick understanding of system health before reviewing detailed job information.

This provides immediate visibility into failures, blocked jobs, conflicts, and business value.

### Exception-Based Monitoring

Instead of forcing users to scan the entire job table, I added dedicated sections for:

- Failed Jobs
- Blocked Jobs
- Scheduling Conflicts

This allows administrators to quickly identify issues that require action.

### Conflict Detection Logic

I implemented conflict detection by checking whether jobs are scheduled for the same archiving object during overlapping execution windows.

This approach is simple and easy to understand while still identifying the most common scheduling issue described in the assessment.

### Client-Side Processing

For this prototype, I used the provided JSON file as the data source and performed all calculations within the SAPUI5 application.

This kept the implementation lightweight and allowed me to focus on the user experience and monitoring capabilities rather than backend development.

---

## From Prototype to SAP BTP Product

For this assessment, all data is loaded from a local JSON file.

In a production scenario, I would implement the solution on SAP BTP using the following architecture:

SAP System → CAP Service → SAPUI5 Dashboard

### SAPUI5 Application

The user interface would continue to be developed in SAPUI5 and deployed to SAP BTP.

### CAP Service

I would use CAP as the backend layer to:

- Retrieve archiving job information from SAP systems
- Calculate KPIs
- Perform conflict detection
- Validate dependencies
- Expose data through OData services

### SAP Connectivity

Data could be collected from customer SAP systems using:

- OData Services
- RFC Connections(For On-premise  system)
- SAP Cloud Connector
- SAP Event Mesh (where applicable)

### Authentication

Authentication and authorisation would be handled using:

- SAP IAS Tenant on BTP
- XSUAA

We can also define different roles for Admin or any other type of user if needed.

### Automated Scheduling

For automated scheduling, I would use SAP BTP Job Scheduler.

The Job Scheduler would trigger scheduling workflows at defined intervals.

Before creating or executing an archiving job, validation logic would verify:

- Dependency completion
- Scheduling conflicts
- Object availability
- Execution windows

This would help prevent common scheduling errors and reduce manual effort for administrators.

---

## Risks and Limitations

### Sample Data

This solution has been built using the sample dataset provided as part of the assessment.

A real implementation would require validation against production data and additional business scenarios.

### Conflict Detection

The current conflict detection logic is intentionally simple and focuses on overlapping schedules for the same archiving object.

In larger landscapes, additional business rules and scheduling constraints may need to be considered.

### Scalability

For simplicity, all calculations are currently performed in the browser.

For larger environments, I would move calculations and filtering to the CAP service to improve performance and scalability.


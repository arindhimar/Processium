/**
 * componentLibrary.js
 * Workflow component definitions used by WorkflowLeftSidebar.
 * Separated into its own module to comply with react-refresh/only-export-components.
 */

// export const componentLibrary = [
//   {
//     category: 'Process Stages',
//     items: [
//       {
//         type: 'trigger',
//         icon: 'bolt',
//         label: 'Trigger',
//         fields: [
//           { key: 'triggerType', label: 'Trigger Type', default: 'Manual' },
//           { key: 'schedule',    label: 'Schedule',     default: 'On Demand' },
//         ],
//       },
//       {
//         type: 'task',
//         icon: 'task_alt',
//         label: 'Task',
//         fields: [
//           { key: 'taskName', label: 'Task Name', default: 'Untitled Task' },
//           { key: 'assignee', label: 'Assignee',  default: 'Unassigned' },
//           { key: 'priority', label: 'Priority',  default: 'Medium' },
//         ],
//       },
//       {
//         type: 'approval',
//         icon: 'how_to_reg',
//         label: 'Approval',
//         fields: [
//           { key: 'approver', label: 'Approver', default: 'Manager' },
//           { key: 'timeout',  label: 'Timeout',  default: '48 hours' },
//         ],
//       },
//       {
//         type: 'condition',
//         icon: 'rule',
//         label: 'Condition',
//         fields: [
//           { key: 'field',    label: 'Field',    default: 'status' },
//           { key: 'operator', label: 'Operator', default: 'equals' },
//           { key: 'value',    label: 'Value',    default: 'approved' },
//         ],
//       },
//       {
//         type: 'flexible',
//         icon: 'extension',
//         label: 'Flexible',
//         subtitle: 'Custom Stage',
//         fields: [
//           { key: 'stageName',   label: 'Stage Name',  default: 'Custom Stage' },
//           { key: 'description', label: 'Description', default: 'No description' },
//         ],
//       },
//     ],
//   },
//   {
//     category: 'Integration Steps',
//     items: [
//       {
//         type: 'notification',
//         icon: 'notifications_active',
//         label: 'Notification',
//         fields: [
//           { key: 'channel',  label: 'Channel',  default: 'Email' },
//           { key: 'template', label: 'Template', default: 'Default' },
//         ],
//       },
//       {
//         type: 'api_call',
//         icon: 'api',
//         label: 'API Call',
//         fields: [
//           { key: 'endpoint', label: 'Endpoint', default: 'https://' },
//           { key: 'method',   label: 'Method',   default: 'POST' },
//         ],
//       },
//       {
//         type: 'delay',
//         icon: 'timer',
//         label: 'Delay',
//         fields: [
//           { key: 'duration', label: 'Duration', default: '1 hour' },
//         ],
//       },
//       {
//         type: 'sub_process',
//         icon: 'account_tree',
//         label: 'Sub-Process',
//         fields: [
//           { key: 'processName', label: 'Process Name', default: 'Untitled' },
//           { key: 'waitFor',     label: 'Wait For',     default: 'Completion' },
//         ],
//       },
//     ],
//   },
// ];


const componentLibrary = [
  {
    category: "Recruitment Stages",
    items: [
      {
        type: "requisition",
        icon: "assignment",
        label: "Requisition",
        fields: [
          { key: "jobTitle", label: "Job Title", default: "Untitled Position" },
          { key: "department", label: "Department", default: "Unassigned" },
          { key: "hiringManager", label: "Hiring Manager", default: "TBD" },
        ],
      },
      {
        type: "job_description",
        icon: "description",
        label: "Job Description",
        fields: [
          { key: "role", label: "Role Summary", default: "No summary" },
          { key: "experience", label: "Experience", default: "Not specified" },
          { key: "location", label: "Location", default: "Remote" },
        ],
      },
      {
        type: "candidate_profile",
        icon: "person_search",
        label: "Candidate Profile",
        fields: [
          { key: "name", label: "Candidate Name", default: "Unnamed" },
          { key: "source", label: "Source", default: "Direct Application" },
          { key: "status", label: "Status", default: "New" },
        ],
      },
      {
        type: "interview",
        icon: "groups",
        label: "Interview",
        fields: [
          { key: "interviewer", label: "Interviewer", default: "TBD" },
          { key: "schedule", label: "Schedule", default: "Not Scheduled" },
          { key: "format", label: "Format", default: "Virtual" },
        ],
      },
      {
        type: "offer",
        icon: "task_alt",
        label: "Offer",
        fields: [
          { key: "salary", label: "Salary Range", default: "Negotiable" },
          { key: "startDate", label: "Start Date", default: "TBD" },
          { key: "benefits", label: "Benefits", default: "Standard Package" },
        ],
      },
      {
        type: "flexible",
        icon: "extension",
        label: "Flexible",
        subtitle: "Custom Stage",
        fields: [
          { key: "stageName", label: "Stage Name", default: "Custom Stage" },
          { key: "description", label: "Description", default: "No description" },
        ],
      },
    ],
  },
  {
    category: "Onboarding Steps",
    items: [
      {
        type: "verification",
        icon: "how_to_reg",
        label: "Verification",
        fields: [
          { key: "docType", label: "Document Type", default: "ID Verification" },
          { key: "status", label: "Status", default: "Pending" },
        ],
      },
      {
        type: "id_badge",
        icon: "badge",
        label: "ID Badge",
        fields: [
          { key: "badgeType", label: "Badge Type", default: "Standard" },
          { key: "accessLevel", label: "Access Level", default: "Level 1" },
        ],
      },
      {
        type: "training",
        icon: "school",
        label: "Training",
        fields: [
          { key: "program", label: "Program", default: "Orientation" },
          { key: "duration", label: "Duration", default: "1 Week" },
          { key: "trainer", label: "Trainer", default: "HR Team" },
        ],
      },
      {
        type: "equipment",
        icon: "laptop_mac",
        label: "Equipment",
        fields: [
          { key: "device", label: "Device", default: "Laptop" },
          { key: "software", label: "Software", default: "Standard Suite" },
        ],
      },
    ],
  },
]

export { componentLibrary }
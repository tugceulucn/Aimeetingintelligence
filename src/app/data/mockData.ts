// Mock data for the MeetInsight AI application

export interface Meeting {
  id: string;
  name: string;
  participants: number;
  duration: number;
  score: number;
  decisions: number;
  actions: number;
  date: string;
  participantNames: string[];
  transcript: { speaker: string; text: string; time: string }[];
  summary: string;
  highlights: string[];
  risks: string[];
  platform: 'zoom' | 'teams' | 'meet';
}

export interface Decision {
  id: string;
  title: string;
  owner: string;
  deadline: string;
  status: 'new' | 'in-progress' | 'completed';
  meetingId: string;
  meetingName: string;
}

export interface ActionItem {
  id: string;
  task: string;
  owner: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  meetingId: string;
  meetingName: string;
}

export const meetings: Meeting[] = [
  {
    id: '1',
    name: 'Product Sprint Planning',
    participants: 6,
    duration: 48,
    score: 82,
    decisions: 3,
    actions: 5,
    date: '2026-03-14',
    participantNames: ['Sarah Chen', 'John Martinez', 'Emma Wilson', 'David Park', 'Lisa Anderson', 'Michael Brown'],
    platform: 'zoom',
    summary: 'The team discussed the upcoming product sprint, prioritizing features for the Q2 release. Key focus areas include the new analytics dashboard and mobile app improvements.',
    highlights: [
      'Analytics dashboard is top priority for Q2',
      'Mobile app requires performance optimization',
      'Need to hire 2 additional frontend developers',
      'Marketing launch planned for June 15'
    ],
    risks: [
      'Timeline is aggressive given current team size',
      'Dependencies on third-party API may cause delays'
    ],
    transcript: [
      { speaker: 'Sarah Chen', text: 'Good morning everyone. Let\'s start with our sprint planning for Q2.', time: '00:00' },
      { speaker: 'John Martinez', text: 'I think we should prioritize the analytics dashboard first.', time: '00:45' },
      { speaker: 'Emma Wilson', text: 'Agreed. The customer feedback has been very clear on this.', time: '01:12' },
      { speaker: 'David Park', text: 'What about the mobile performance issues?', time: '02:30' },
      { speaker: 'Sarah Chen', text: 'Good point. Let\'s make that our second priority.', time: '02:55' },
      { speaker: 'Lisa Anderson', text: 'We\'ll need additional resources to hit the June deadline.', time: '04:20' },
    ]
  },
  {
    id: '2',
    name: 'Sales Team Sync',
    participants: 4,
    duration: 35,
    score: 68,
    decisions: 2,
    actions: 3,
    date: '2026-03-13',
    participantNames: ['Tom Wilson', 'Rachel Green', 'Alex Thompson', 'Nina Patel'],
    platform: 'teams',
    summary: 'Sales team reviewed Q1 performance and discussed strategies for improving conversion rates. Focus on enterprise customers was emphasized.',
    highlights: [
      'Q1 revenue exceeded targets by 12%',
      'Enterprise segment shows most growth potential',
      'New pricing model to be tested with select customers'
    ],
    risks: [
      'Churn rate increased in SMB segment',
      'Competitor launched similar features'
    ],
    transcript: [
      { speaker: 'Tom Wilson', text: 'Q1 numbers look great overall.', time: '00:00' },
      { speaker: 'Rachel Green', text: 'Yes, but we\'re seeing some churn in SMB accounts.', time: '00:30' },
      { speaker: 'Alex Thompson', text: 'Enterprise is where we should focus.', time: '01:15' },
    ]
  },
  {
    id: '3',
    name: 'Engineering Standup',
    participants: 8,
    duration: 22,
    score: 91,
    decisions: 1,
    actions: 4,
    date: '2026-03-14',
    participantNames: ['Chris Lee', 'Amanda Ross', 'Kevin Zhang', 'Sophia Taylor', 'Mark Johnson', 'Emily Davis', 'Ryan Kim', 'Jessica Liu'],
    platform: 'meet',
    summary: 'Daily standup covering sprint progress, blockers, and upcoming tasks. Team is on track for sprint completion.',
    highlights: [
      'API integration completed ahead of schedule',
      'Frontend components 80% complete',
      'Testing framework setup finished'
    ],
    risks: [],
    transcript: [
      { speaker: 'Chris Lee', text: 'Quick standup today. Let\'s go around.', time: '00:00' },
      { speaker: 'Amanda Ross', text: 'I finished the API integration yesterday.', time: '00:15' },
      { speaker: 'Kevin Zhang', text: 'Frontend is progressing well, about 80% done.', time: '00:40' },
    ]
  },
  {
    id: '4',
    name: 'Marketing Campaign Review',
    participants: 5,
    duration: 55,
    score: 74,
    decisions: 4,
    actions: 7,
    date: '2026-03-12',
    participantNames: ['Jennifer Miller', 'Brian Adams', 'Olivia White', 'Daniel Scott', 'Victoria Lee'],
    platform: 'zoom',
    summary: 'Review of Q1 marketing campaign performance and planning for Q2 initiatives. Social media strategy needs refinement.',
    highlights: [
      'Email campaign exceeded open rate targets',
      'Social media engagement up 45%',
      'Content marketing driving quality leads',
      'Webinar series proposed for Q2'
    ],
    risks: [
      'Budget constraints for paid advertising',
      'Need more video content resources'
    ],
    transcript: [
      { speaker: 'Jennifer Miller', text: 'Our email campaigns performed really well this quarter.', time: '00:00' },
      { speaker: 'Brian Adams', text: 'Social media is our biggest win. 45% increase in engagement.', time: '01:20' },
    ]
  },
  {
    id: '5',
    name: 'Customer Success Check-in',
    participants: 3,
    duration: 40,
    score: 79,
    decisions: 2,
    actions: 4,
    date: '2026-03-11',
    participantNames: ['Laura Martinez', 'James Wilson', 'Sophie Anderson'],
    platform: 'teams',
    summary: 'Discussion of customer health scores and strategies for improving retention. Enterprise customers showing strong satisfaction.',
    highlights: [
      'Overall NPS score at 72',
      'Enterprise customer satisfaction at all-time high',
      'New onboarding process reducing time-to-value'
    ],
    risks: [
      'Support response times need improvement',
      'Documentation gaps identified'
    ],
    transcript: []
  },
  {
    id: '6',
    name: 'Product Roadmap Discussion',
    participants: 7,
    duration: 63,
    score: 65,
    decisions: 2,
    actions: 3,
    date: '2026-03-10',
    participantNames: ['Sarah Chen', 'John Martinez', 'Emma Wilson', 'Tom Wilson', 'Chris Lee', 'Jennifer Miller', 'Laura Martinez'],
    platform: 'meet',
    summary: 'Cross-functional meeting to align on product roadmap priorities. Meeting ran over time with some off-topic discussions.',
    highlights: [
      'Q2 roadmap finalized',
      'AI features to be prioritized',
      'Mobile app redesign scheduled for Q3'
    ],
    risks: [
      'Scope creep concerns raised',
      'Resource allocation conflicts between teams'
    ],
    transcript: []
  }
];

export const decisions: Decision[] = [
  {
    id: '1',
    title: 'Launch new analytics dashboard in Q2',
    owner: 'Product Team',
    deadline: '2026-06-15',
    status: 'in-progress',
    meetingId: '1',
    meetingName: 'Product Sprint Planning'
  },
  {
    id: '2',
    title: 'Hire 2 frontend developers',
    owner: 'Sarah Chen',
    deadline: '2026-04-30',
    status: 'new',
    meetingId: '1',
    meetingName: 'Product Sprint Planning'
  },
  {
    id: '3',
    title: 'Test new pricing model with enterprise customers',
    owner: 'Sales Team',
    deadline: '2026-04-15',
    status: 'in-progress',
    meetingId: '2',
    meetingName: 'Sales Team Sync'
  },
  {
    id: '4',
    title: 'Focus sales efforts on enterprise segment',
    owner: 'Tom Wilson',
    deadline: '2026-03-31',
    status: 'in-progress',
    meetingId: '2',
    meetingName: 'Sales Team Sync'
  },
  {
    id: '5',
    title: 'Launch webinar series for Q2',
    owner: 'Marketing Team',
    deadline: '2026-04-01',
    status: 'new',
    meetingId: '4',
    meetingName: 'Marketing Campaign Review'
  },
  {
    id: '6',
    title: 'Improve support response times',
    owner: 'Customer Success',
    deadline: '2026-04-10',
    status: 'new',
    meetingId: '5',
    meetingName: 'Customer Success Check-in'
  },
  {
    id: '7',
    title: 'Prioritize AI features for Q2',
    owner: 'Product Team',
    deadline: '2026-06-30',
    status: 'new',
    meetingId: '6',
    meetingName: 'Product Roadmap Discussion'
  },
  {
    id: '8',
    title: 'Mobile app redesign for Q3',
    owner: 'Design Team',
    deadline: '2026-09-30',
    status: 'new',
    meetingId: '6',
    meetingName: 'Product Roadmap Discussion'
  }
];

export const actionItems: ActionItem[] = [
  {
    id: '1',
    task: 'Prepare detailed roadmap for analytics dashboard',
    owner: 'John Martinez',
    dueDate: '2026-03-20',
    status: 'in-progress',
    meetingId: '1',
    meetingName: 'Product Sprint Planning'
  },
  {
    id: '2',
    task: 'Post job descriptions for frontend roles',
    owner: 'Sarah Chen',
    dueDate: '2026-03-18',
    status: 'pending',
    meetingId: '1',
    meetingName: 'Product Sprint Planning'
  },
  {
    id: '3',
    task: 'Update marketing plan with launch timeline',
    owner: 'Jennifer Miller',
    dueDate: '2026-03-22',
    status: 'pending',
    meetingId: '1',
    meetingName: 'Product Sprint Planning'
  },
  {
    id: '4',
    task: 'Analyze mobile app performance bottlenecks',
    owner: 'Emma Wilson',
    dueDate: '2026-03-25',
    status: 'in-progress',
    meetingId: '1',
    meetingName: 'Product Sprint Planning'
  },
  {
    id: '5',
    task: 'Research third-party API alternatives',
    owner: 'David Park',
    dueDate: '2026-03-28',
    status: 'pending',
    meetingId: '1',
    meetingName: 'Product Sprint Planning'
  },
  {
    id: '6',
    task: 'Create pricing model proposal for enterprise',
    owner: 'Rachel Green',
    dueDate: '2026-03-19',
    status: 'in-progress',
    meetingId: '2',
    meetingName: 'Sales Team Sync'
  },
  {
    id: '7',
    task: 'Prepare Q1 sales report',
    owner: 'Tom Wilson',
    dueDate: '2026-03-17',
    status: 'in-progress',
    meetingId: '2',
    meetingName: 'Sales Team Sync'
  },
  {
    id: '8',
    task: 'Investigate SMB churn reasons',
    owner: 'Alex Thompson',
    dueDate: '2026-03-21',
    status: 'pending',
    meetingId: '2',
    meetingName: 'Sales Team Sync'
  },
  {
    id: '9',
    task: 'Complete frontend component library',
    owner: 'Kevin Zhang',
    dueDate: '2026-03-16',
    status: 'in-progress',
    meetingId: '3',
    meetingName: 'Engineering Standup'
  },
  {
    id: '10',
    task: 'Write integration tests',
    owner: 'Amanda Ross',
    dueDate: '2026-03-18',
    status: 'pending',
    meetingId: '3',
    meetingName: 'Engineering Standup'
  },
  {
    id: '11',
    task: 'Deploy staging environment',
    owner: 'Chris Lee',
    dueDate: '2026-03-19',
    status: 'pending',
    meetingId: '3',
    meetingName: 'Engineering Standup'
  },
  {
    id: '12',
    task: 'Update component documentation',
    owner: 'Sophia Taylor',
    dueDate: '2026-03-20',
    status: 'pending',
    meetingId: '3',
    meetingName: 'Engineering Standup'
  },
  {
    id: '13',
    task: 'Plan webinar content calendar',
    owner: 'Brian Adams',
    dueDate: '2026-03-25',
    status: 'pending',
    meetingId: '4',
    meetingName: 'Marketing Campaign Review'
  },
  {
    id: '14',
    task: 'Create video content brief',
    owner: 'Olivia White',
    dueDate: '2026-03-23',
    status: 'pending',
    meetingId: '4',
    meetingName: 'Marketing Campaign Review'
  },
  {
    id: '15',
    task: 'Analyze Q1 campaign performance data',
    owner: 'Daniel Scott',
    dueDate: '2026-03-18',
    status: 'in-progress',
    meetingId: '4',
    meetingName: 'Marketing Campaign Review'
  },
  {
    id: '16',
    task: 'Update customer health score dashboard',
    owner: 'Laura Martinez',
    dueDate: '2026-03-17',
    status: 'in-progress',
    meetingId: '5',
    meetingName: 'Customer Success Check-in'
  },
  {
    id: '17',
    task: 'Document common support issues',
    owner: 'James Wilson',
    dueDate: '2026-03-20',
    status: 'pending',
    meetingId: '5',
    meetingName: 'Customer Success Check-in'
  },
  {
    id: '18',
    task: 'Create product feature comparison doc',
    owner: 'Sophie Anderson',
    dueDate: '2026-03-22',
    status: 'pending',
    meetingId: '5',
    meetingName: 'Customer Success Check-in'
  }
];

export const teamAnalytics = {
  engineering: {
    meetingsPerWeek: 14,
    decisionRate: 38,
    avgDuration: 52,
    productivity: 78
  },
  product: {
    meetingsPerWeek: 9,
    decisionRate: 45,
    avgDuration: 48,
    productivity: 82
  },
  sales: {
    meetingsPerWeek: 18,
    decisionRate: 28,
    avgDuration: 38,
    productivity: 71
  },
  marketing: {
    meetingsPerWeek: 7,
    decisionRate: 42,
    avgDuration: 55,
    productivity: 74
  }
};

export const weeklyProductivity = [
  { week: 'Week 1', score: 72 },
  { week: 'Week 2', score: 68 },
  { week: 'Week 3', score: 74 },
  { week: 'Week 4', score: 71 },
  { week: 'Week 5', score: 76 },
  { week: 'Week 6', score: 78 },
];

export const meetingWaste = [
  { name: 'Productive', value: 52, color: '#22C55E' },
  { name: 'Neutral', value: 33, color: '#F59E0B' },
  { name: 'Wasteful', value: 15, color: '#EF4444' }
];

export const teamMeetingHours = [
  { team: 'Engineering', hours: 8 },
  { team: 'Product', hours: 5 },
  { team: 'Sales', hours: 12 },
  { team: 'Marketing', hours: 4 },
  { team: 'Customer Success', hours: 6 }
];

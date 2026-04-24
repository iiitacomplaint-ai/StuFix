import React from 'react';
import { useSelector } from 'react-redux';
import { 
  GraduationCap, 
  LayoutDashboard, 
  FileText, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Shield,
  Users,
  Eye,
  Bell,
  Mail,
  Phone,
  HelpCircle
} from 'lucide-react';

const InfoSection = () => {
  // Role configuration with styles, icons, and colors
  const roleConfig = {
    user: {
      name: 'Student',
      icon: <GraduationCap className="h-8 w-8" />,
      gradient: 'from-purple-600 to-indigo-600',
      accent: 'purple',
      bgPattern: 'bg-gradient-to-br from-purple-50 to-white'
    },
    worker: {
      name: 'Department Worker',
      icon: <Users className="h-8 w-8" />,
      gradient: 'from-blue-600 to-cyan-600',
      accent: 'blue',
      bgPattern: 'bg-gradient-to-br from-blue-50 to-white'
    },
    admin: {
      name: 'System Administrator',
      icon: <Shield className="h-8 w-8" />,
      gradient: 'from-purple-700 to-indigo-800',
      accent: 'indigo',
      bgPattern: 'bg-gradient-to-br from-indigo-50 to-white'
    }
  };

  // Get user role from Redux state
  const userRole = useSelector(state => state.user.user?.role);
  
  // Get the current role configuration, default to student if role not found
  const currentRole = roleConfig[userRole] || roleConfig.user;

  // Role-specific content
  const contentByRole = {
    user: [
      {
        title: 'Submit a Complaint',
        icon: <FileText className="h-6 w-6" />,
        description: 'Step-by-step guide to submit your complaint effectively',
        content: [
          'Access the dashboard and click on "Add Complaint" button',
          'Select appropriate category: Network, Cleaning, Carpentry, PC Maintenance, Plumbing, or Electricity',
          'Provide a clear title and detailed description of the issue',
          'Set priority level: Low, Medium, or High based on urgency',
          'Upload supporting evidence (images, videos, or PDFs - max 3 files, 10MB each)',
          'Submit and receive instant complaint ID for tracking'
        ]
      },
      {
        title: 'Track Your Complaint',
        icon: <Eye className="h-6 w-6" />,
        description: 'Real-time monitoring of your complaint status',
        content: [
          'View all your complaints on the dashboard with current status',
          'Track progress through stages: Submitted → Assigned → In Progress → Resolved → Closed',
          'Check worker remarks and resolution details',
          'Receive notifications when status changes',
          'View complete status history with timestamps'
        ]
      },
      {
        title: 'Complaint Status Guide',
        icon: <Clock className="h-6 w-6" />,
        description: 'Understanding different complaint statuses',
        content: [
          'Submitted: Complaint successfully submitted, awaiting admin assignment',
          'Assigned: Complaint assigned to a department worker',
          'In Progress: Worker is actively working on your complaint',
          'Resolved: Issue has been fixed, waiting for your confirmation',
          'Closed: Complaint successfully resolved and closed',
          'Escalated: Issue requires higher authority attention',
          'Withdrawn: Complaint withdrawn by you (only possible before assignment)'
        ]
      },
      {
        title: 'Tips for Effective Complaints',
        icon: <HelpCircle className="h-6 w-6" />,
        description: 'Best practices to get faster resolution',
        content: [
          'Be specific about the location (building, room number, floor)',
          'Provide clear before/after photos when possible',
          'Set appropriate priority level (High for urgent issues)',
          'Keep contact details updated for worker communication',
          'Respond promptly to worker queries',
          'Provide feedback after resolution to improve service'
        ]
      }
    ],
    worker: [
      {
        title: 'View Assigned Complaints',
        icon: <LayoutDashboard className="h-6 w-6" />,
        description: 'Managing complaints assigned to your department',
        content: [
          'Access dashboard to view all complaints assigned to you',
          'Filter complaints by status, priority, or category',
          'Search complaints by student name or title',
          'View complete complaint details including student information',
          'Check attached media for better understanding of the issue'
        ]
      },
      {
        title: 'Update Complaint Status',
        icon: <CheckCircle className="h-6 w-6" />,
        description: 'Proper workflow for status updates',
        content: [
          'Assigned → In Progress: When you start working on the complaint',
          'In Progress → Resolved: After fixing the issue',
          'Escalated → In Progress: When taking back escalated complaints',
          'Always add detailed remarks explaining the action taken',
          'Update location/room status after resolution'
        ]
      },
      {
        title: 'Resolution Guidelines',
        icon: <TrendingUp className="h-6 w-6" />,
        description: 'Best practices for complaint resolution',
        content: [
          'Acknowledge complaint within 24 hours of assignment',
          'Contact student if additional information needed',
          'Document all actions taken in remarks section',
          'Take before/after photos for documentation',
          'Aim for resolution within 48 hours of assignment',
          'Escalate to admin if unable to resolve'
        ]
      },
      {
        title: 'Performance Metrics',
        icon: <Clock className="h-6 w-6" />,
        description: 'Track your efficiency and performance',
        content: [
          'Monitor your resolution rate and efficiency percentage',
          'Track average resolution time per complaint',
          'View total complaints assigned, in-progress, and resolved',
          'Performance data helps in department evaluation',
          'Maintain high efficiency for better ratings'
        ]
      }
    ],
    admin: [
      {
        title: 'Worker Management',
        icon: <Users className="h-6 w-6" />,
        description: 'Complete worker administration',
        content: [
          'Add new workers to the system with department assignment',
          'View all workers with their performance metrics',
          'Monitor worker efficiency and complaint resolution rates',
          'Delete or update worker information as needed',
          'Auto-generated credentials sent via email to new workers'
        ]
      },
      {
        title: 'Complaint Assignment',
        icon: <FileText className="h-6 w-6" />,
        description: 'Efficient complaint distribution',
        content: [
          'Review submitted complaints awaiting assignment',
          'Assign complaints to workers based on department match',
          'Ensure fair distribution of workload across workers',
          'Reassign complaints when necessary',
          'Monitor unassigned complaints and assign promptly'
        ]
      },
      {
        title: 'System Monitoring',
        icon: <TrendingUp className="h-6 w-6" />,
        description: 'Complete system oversight',
        content: [
          'View all complaints across all departments',
          'Filter complaints by status, category, or priority',
          'Monitor overall resolution rates and response times',
          'Access audit logs for complete accountability',
          'Track system performance and user activity'
        ]
      },
      {
        title: 'Audit & Compliance',
        icon: <Shield className="h-6 w-6" />,
        description: 'Ensuring system integrity',
        content: [
          'Review complete audit logs of all system actions',
          'Track who assigned, updated, or resolved complaints',
          'Monitor worker performance and accountability',
          'Ensure compliance with data protection policies',
          'Generate reports for management review'
        ]
      }
    ]
  };

  // InfoCard component for rendering each information card
  const InfoCard = ({ title, icon, description, content, index }) => (
    <div className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 ${
      index % 2 === 0 ? 'lg:translate-y-4' : ''
    }`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${currentRole.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      
      <div className="relative p-8">
        <div className="flex items-center mb-4">
          <div className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${currentRole.gradient} shadow-lg mr-4 text-white`}>
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {content.map((item, itemIndex) => (
            <div key={itemIndex} className="flex items-start group/item">
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentRole.gradient} mt-2 mr-3 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-300`}></div>
              <p className="text-gray-700 text-sm leading-relaxed group-hover/item:text-gray-900 transition-colors duration-300">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${currentRole.bgPattern} py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br ${currentRole.gradient} shadow-2xl mb-6 text-white`}>
            {currentRole.icon}
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            <span className={`bg-gradient-to-r ${currentRole.gradient} bg-clip-text text-transparent`}>
              {currentRole.name}
            </span>
            <br />
            <span className="text-gray-800">Information Center</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive guidance and system information tailored specifically for your role
          </p>
        </div>

        {/* Role Badge */}
        <div className="flex justify-center mb-12">
          <div className={`inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r ${currentRole.gradient} text-white font-semibold shadow-2xl transform hover:scale-105 transition-transform duration-300`}>
            <span className="mr-3">{currentRole.icon}</span>
            <span className="text-lg">Active Role: {currentRole.name}</span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {contentByRole[userRole]?.map((section, index) => (
            <InfoCard
              key={index}
              title={section.title}
              icon={section.icon}
              description={section.description}
              content={section.content}
              index={index}
            />
          ))}
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${currentRole.gradient} shadow-lg mb-6 text-white`}>
            <HelpCircle className="h-8 w-8" />
          </div>
          
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Need Additional Assistance?
          </h3>
          
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
            Our dedicated support team is available to help you with any questions or technical issues.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => window.location.href = 'mailto:support@iiita.ac.in'}
              className={`flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r ${currentRole.gradient} text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}
            >
              <Mail className="h-5 w-5 mr-2" />
              Email Support
            </button>

            <button
              onClick={() => window.location.href = '/contact'}
              className="flex items-center justify-center px-6 py-3 rounded-xl bg-white border-2 border-purple-200 text-purple-700 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:bg-purple-50"
            >
              <Phone className="h-5 w-5 mr-2" />
              Contact Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
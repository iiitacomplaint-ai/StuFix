import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  AlertTriangle, 
  Info, 
  GraduationCap,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

const InfoPage = () => {
  const sections = [
    {
      title: "Dashboard",
      description: "Your central hub. Get a summary of your complaint activity, view important statistics (total complaints, pending, resolved, escalated), and track ongoing operations at a glance.",
      icon: <LayoutDashboard className="h-6 w-6" />,
      color: "purple"
    },
    {
      title: "Submit Complaint",
      description: "File new complaints about campus issues including network problems, cleaning, carpentry, PC maintenance, plumbing, and electricity. Add title, description, priority level, and upload supporting evidence.",
      icon: <FileText className="h-6 w-6" />,
      color: "blue"
    },
    {
      title: "My Complaints",
      description: "View all your submitted complaints with real-time status tracking. Monitor progress from submission to assignment, resolution, and closure. Access complete history and worker remarks.",
      icon: <CheckCircle className="h-6 w-6" />,
      color: "green"
    },
    {
      title: "Worker Dashboard",
      description: "For assigned workers: View complaints assigned to your department, update status (Assigned → In Progress → Resolved), add resolution remarks, and track your performance metrics.",
      icon: <Users className="h-6 w-6" />,
      color: "orange"
    },
    {
      title: "Admin Dashboard",
      description: "For administrators: Manage workers, assign complaints to appropriate departments, view all complaints across campus, monitor system performance, and access audit logs for accountability.",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "red"
    },
    {
      title: "Status Tracking",
      description: "Track complaint through various stages: Submitted → Assigned → In Progress → Resolved → Closed. Also includes Escalated and Withdrawn statuses for special cases.",
      icon: <Clock className="h-6 w-6" />,
      color: "teal"
    }
  ];

  const quickStats = [
    { label: "Departments", value: "6", color: "bg-purple-100 text-purple-600" },
    { label: "Resolution Time", value: "< 48h", color: "bg-green-100 text-green-600" },
    { label: "Track Status", value: "Real-time", color: "bg-blue-100 text-blue-600" },
    { label: "Support", value: "24/7", color: "bg-orange-100 text-orange-600" }
  ];

  const getColorClasses = (color) => {
    const colors = {
      purple: "border-purple-500 bg-purple-50",
      blue: "border-blue-500 bg-blue-50",
      green: "border-green-500 bg-green-50",
      orange: "border-orange-500 bg-orange-50",
      red: "border-red-500 bg-red-50",
      teal: "border-teal-500 bg-teal-50"
    };
    return colors[color] || colors.purple;
  };

  const getIconColor = (color) => {
    const colors = {
      purple: "text-purple-600",
      blue: "text-blue-600",
      green: "text-green-600",
      orange: "text-orange-600",
      red: "text-red-600",
      teal: "text-teal-600"
    };
    return colors[color] || colors.purple;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-4">
            <GraduationCap className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">IIIT Allahabad</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            College Complaint System Guide
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            A complete guide to understanding and using the complaint management system effectively
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {quickStats.map((stat, index) => (
            <div key={index} className={`${stat.color} rounded-xl p-4 text-center`}>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Sections Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 ${getColorClasses(section.color)} group hover:-translate-y-1`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`p-2 rounded-lg ${getColorClasses(section.color)}`}>
                  <div className={getIconColor(section.color)}>
                    {section.icon}
                  </div>
                </div>
                <h2 className={`text-xl font-semibold ${getIconColor(section.color)}`}>
                  {section.title}
                </h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed pl-12">
                {section.description}
              </p>
            </div>
          ))}
        </div>

        {/* Status Flow Visualization */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Complaint Status Flow</h2>
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
            {['Submitted', 'Assigned', 'In Progress', 'Resolved', 'Closed'].map((status, index) => (
              <React.Fragment key={status}>
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    status === 'Submitted' ? 'bg-yellow-500' :
                    status === 'Assigned' ? 'bg-blue-500' :
                    status === 'In Progress' ? 'bg-purple-500' :
                    status === 'Resolved' ? 'bg-green-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-xs text-gray-600 mt-1">{status}</span>
                </div>
                {index < 4 && (
                  <ChevronRight className="h-4 w-4 text-gray-300" />
                )}
              </React.Fragment>
            ))}
          </div>
          <p className="text-center text-xs text-gray-500 mt-4">
            Additional statuses: Escalated (for unresolved issues) | Withdrawn (cancelled by user)
          </p>
        </div>

        {/* Footer Note */}
        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm">
            Need help? Contact your department admin or reach out to support@iiita.ac.in
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Together, we can build a better campus experience. Your feedback matters.
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper component for ChevronRight
const ChevronRight = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default InfoPage;
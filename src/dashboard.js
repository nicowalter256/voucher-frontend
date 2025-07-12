import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Server, 
  Smartphone, 
  CreditCard, 
  Shield, 
  Users, 
  BarChart3,
  Database,
  Wifi,
  MessageSquare,
  Settings,
  Globe,
  Code,
  FileText,
  DollarSign,
  ChevronRight,
  ChevronDown,
  Play,
  Pause,
  AlertCircle,
  TrendingUp,
  Lock,
  Cloud,
  LogOut,
  User
} from 'lucide-react';

const MoWaveArchitectureApp = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [completedComponents, setCompletedComponents] = useState(new Set());
  const [expandedSections, setExpandedSections] = useState(new Set(['core']));
  const [systemStatus, setSystemStatus] = useState('planning');
  const [progress, setProgress] = useState(0);

  const systemComponents = {
    core: {
      title: '🧩 Core System Architecture',
      icon: <Server className="w-5 h-5" />,
      components: [
        {
          id: 'frontend',
          name: 'Frontend (Client-Facing UI)',
          icon: <Globe className="w-4 h-4" />,
          description: 'User dashboard, admin panel, responsive design',
          tech: 'React.js/Vue.js',
          priority: 'high',
          status: 'pending'
        },
        {
          id: 'backend',
          name: 'Backend (Server-Side Logic)',
          icon: <Server className="w-4 h-4" />,
          description: 'Voucher management, payment processing, RADIUS communication',
          tech: 'Node.js/Python',
          priority: 'high',
          status: 'pending'
        },
        {
          id: 'database',
          name: 'Database',
          icon: <Database className="w-4 h-4" />,
          description: 'User data, vouchers, payment logs, session history',
          tech: 'PostgreSQL/MySQL',
          priority: 'high',
          status: 'pending'
        },
        {
          id: 'hosting',
          name: 'Hosting Infrastructure',
          icon: <Cloud className="w-4 h-4" />,
          description: 'VPS, domain setup, uptime monitoring',
          tech: 'DigitalOcean/AWS',
          priority: 'medium',
          status: 'pending'
        }
      ]
    },
    hotspot: {
      title: '🔌 Hotspot Integration',
      icon: <Wifi className="w-5 h-5" />,
      components: [
        {
          id: 'radius',
          name: 'RADIUS Server',
          icon: <Shield className="w-4 h-4" />,
          description: 'Authentication for voucher users',
          tech: 'FreeRADIUS',
          priority: 'high',
          status: 'pending'
        },
        {
          id: 'captive',
          name: 'Captive Portal System',
          icon: <Globe className="w-4 h-4" />,
          description: 'Login/payment page redirection',
          tech: 'Custom Portal',
          priority: 'high',
          status: 'pending'
        },
        {
          id: 'compatibility',
          name: 'Router Compatibility',
          icon: <Wifi className="w-4 h-4" />,
          description: 'MikroTik, Omada, Ubiquiti support',
          tech: 'Multi-vendor',
          priority: 'medium',
          status: 'pending'
        }
      ]
    },
    payment: {
      title: '💳 Payment Gateway Integration',
      icon: <CreditCard className="w-5 h-5" />,
      components: [
        {
          id: 'mtn',
          name: 'MTN MoMo API',
          icon: <Smartphone className="w-4 h-4" />,
          description: 'MTN Mobile Money integration',
          tech: 'MTN API',
          priority: 'high',
          status: 'pending'
        },
        {
          id: 'airtel',
          name: 'Airtel Money API',
          icon: <Smartphone className="w-4 h-4" />,
          description: 'Airtel payment platform',
          tech: 'Airtel API',
          priority: 'high',
          status: 'pending'
        },
        {
          id: 'cards',
          name: 'Visa/Mastercard',
          icon: <CreditCard className="w-4 h-4" />,
          description: 'Card payment processing',
          tech: 'Pesapal/Flutterwave',
          priority: 'medium',
          status: 'pending'
        }
      ]
    },
    sms: {
      title: '📱 SMS Notification System',
      icon: <MessageSquare className="w-5 h-5" />,
      components: [
        {
          id: 'sms-gateway',
          name: 'SMS Gateway/API',
          icon: <MessageSquare className="w-4 h-4" />,
          description: 'Send voucher codes and alerts',
          tech: 'Twilio/Africa\'s Talking',
          priority: 'medium',
          status: 'pending'
        },
        {
          id: 'sms-triggers',
          name: 'SMS Triggers',
          icon: <Settings className="w-4 h-4" />,
          description: 'Automated message triggers',
          tech: 'Custom Logic',
          priority: 'medium',
          status: 'pending'
        }
      ]
    },
    admin: {
      title: '🔧 Admin & Vendor Tools',
      icon: <Users className="w-5 h-5" />,
      components: [
        {
          id: 'voucher-mgmt',
          name: 'Voucher Management',
          icon: <Settings className="w-4 h-4" />,
          description: 'Generate, activate, revoke vouchers',
          tech: 'Admin Panel',
          priority: 'high',
          status: 'pending'
        },
        {
          id: 'vendor-panel',
          name: 'Reseller/Vendor Panel',
          icon: <Users className="w-4 h-4" />,
          description: 'Vendor sales tracking and commissions',
          tech: 'Web Dashboard',
          priority: 'medium',
          status: 'pending'
        },
        {
          id: 'analytics',
          name: 'Analytics Dashboard',
          icon: <BarChart3 className="w-4 h-4" />,
          description: 'Revenue stats, usage trends',
          tech: 'Chart.js/D3',
          priority: 'medium',
          status: 'pending'
        },
        {
          id: 'branding',
          name: 'Branding Options',
          icon: <Settings className="w-4 h-4" />,
          description: 'Custom themes and whitelabel',
          tech: 'CSS/Themes',
          priority: 'low',
          status: 'pending'
        }
      ]
    },
    security: {
      title: '🔐 Security Setup',
      icon: <Shield className="w-5 h-5" />,
      components: [
        {
          id: 'ssl',
          name: 'HTTPS/SSL',
          icon: <Lock className="w-4 h-4" />,
          description: 'SSL certificate implementation',
          tech: 'Let\'s Encrypt',
          priority: 'high',
          status: 'pending'
        },
        {
          id: 'validation',
          name: 'Input Validation',
          icon: <Shield className="w-4 h-4" />,
          description: 'XSS/SQL injection protection',
          tech: 'Security Middleware',
          priority: 'high',
          status: 'pending'
        },
        {
          id: 'audit',
          name: 'Audit Logs',
          icon: <FileText className="w-4 h-4" />,
          description: 'Security logging and IP tracking',
          tech: 'Custom Logging',
          priority: 'medium',
          status: 'pending'
        }
      ]
    },
    devops: {
      title: '🛠️ DevOps & Maintenance',
      icon: <Code className="w-5 h-5" />,
      components: [
        {
          id: 'versioning',
          name: 'Code Versioning',
          icon: <Code className="w-4 h-4" />,
          description: 'Git repository management',
          tech: 'GitHub/GitLab',
          priority: 'high',
          status: 'pending'
        },
        {
          id: 'cicd',
          name: 'CI/CD Pipeline',
          icon: <Settings className="w-4 h-4" />,
          description: 'Automated deployment',
          tech: 'GitHub Actions',
          priority: 'medium',
          status: 'pending'
        },
        {
          id: 'backups',
          name: 'Backups & Recovery',
          icon: <Database className="w-4 h-4" />,
          description: 'Daily database backups',
          tech: 'Automated Scripts',
          priority: 'high',
          status: 'pending'
        }
      ]
    },
    testing: {
      title: '🧪 Testing & QA',
      icon: <CheckCircle className="w-5 h-5" />,
      components: [
        {
          id: 'manual-testing',
          name: 'Manual Testing',
          icon: <CheckCircle className="w-4 h-4" />,
          description: 'Payment flow, SMS delivery testing',
          tech: 'Manual QA',
          priority: 'high',
          status: 'pending'
        },
        {
          id: 'automated-testing',
          name: 'Automated Testing',
          icon: <Code className="w-4 h-4" />,
          description: 'Unit & integration tests',
          tech: 'Jest/Pytest',
          priority: 'medium',
          status: 'pending'
        },
        {
          id: 'uat',
          name: 'User Acceptance Testing',
          icon: <Users className="w-4 h-4" />,
          description: 'Pilot client testing',
          tech: 'UAT Process',
          priority: 'medium',
          status: 'pending'
        }
      ]
    },
    documentation: {
      title: '📄 Documentation & Support',
      icon: <FileText className="w-5 h-5" />,
      components: [
        {
          id: 'admin-manual',
          name: 'Admin Manual',
          icon: <FileText className="w-4 h-4" />,
          description: 'Setup and troubleshooting guide',
          tech: 'Documentation',
          priority: 'medium',
          status: 'pending'
        },
        {
          id: 'vendor-guide',
          name: 'Vendor Guide',
          icon: <Users className="w-4 h-4" />,
          description: 'Reseller instructions',
          tech: 'Documentation',
          priority: 'medium',
          status: 'pending'
        },
        {
          id: 'user-faqs',
          name: 'End-User FAQs',
          icon: <MessageSquare className="w-4 h-4" />,
          description: 'Customer support documentation',
          tech: 'FAQ System',
          priority: 'low',
          status: 'pending'
        }
      ]
    },
    monetization: {
      title: '📢 Monetization Add-ons',
      icon: <DollarSign className="w-5 h-5" />,
      components: [
        {
          id: 'ad-engine',
          name: 'Ad Engine',
          icon: <TrendingUp className="w-4 h-4" />,
          description: 'Floating ads on captive portal',
          tech: 'Ad Integration',
          priority: 'low',
          status: 'pending'
        },
        {
          id: 'referral',
          name: 'Referral System',
          icon: <Users className="w-4 h-4" />,
          description: 'User referral rewards',
          tech: 'Referral Logic',
          priority: 'low',
          status: 'pending'
        },
        {
          id: 'wallet',
          name: 'Top-Up Wallet',
          icon: <CreditCard className="w-4 h-4" />,
          description: 'User wallet system',
          tech: 'Wallet API',
          priority: 'low',
          status: 'pending'
        },
        {
          id: 'loyalty',
          name: 'Loyalty Program',
          icon: <TrendingUp className="w-4 h-4" />,
          description: 'Points and rewards system',
          tech: 'Loyalty Engine',
          priority: 'low',
          status: 'pending'
        }
      ]
    }
  };

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const toggleComponent = (componentId) => {
    const newCompleted = new Set(completedComponents);
    if (newCompleted.has(componentId)) {
      newCompleted.delete(componentId);
    } else {
      newCompleted.add(componentId);
    }
    setCompletedComponents(newCompleted);
  };

  const getTotalComponents = () => {
    return Object.values(systemComponents).reduce((total, section) => {
      return total + section.components.length;
    }, 0);
  };

  const getCompletedCount = () => {
    return completedComponents.size;
  };

  const getProgressPercentage = () => {
    const total = getTotalComponents();
    const completed = getCompletedCount();
    return total > 0 ? (completed / total) * 100 : 0;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (componentId) => {
    if (completedComponents.has(componentId)) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  useEffect(() => {
    const percentage = getProgressPercentage();
    setProgress(percentage);
    
    if (percentage === 100) {
      setSystemStatus('completed');
    } else if (percentage > 0) {
      setSystemStatus('in-progress');
    } else {
      setSystemStatus('planning');
    }
  }, [completedComponents]);

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">MoWave Hotspot System</h2>
        <p className="text-blue-100">Comprehensive architecture for hotspot voucher management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700">Total Components</h3>
            <Settings className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{getTotalComponents()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700">Completed</h3>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">{getCompletedCount()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700">Progress</h3>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="font-semibold text-gray-700 mb-4">System Status</h3>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-2">
          {systemStatus === 'planning' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
          {systemStatus === 'in-progress' && <Play className="w-5 h-5 text-blue-500" />}
          {systemStatus === 'completed' && <CheckCircle className="w-5 h-5 text-green-500" />}
          <span className="capitalize font-medium">{systemStatus.replace('-', ' ')}</span>
        </div>
      </div>
    </div>
  );

  const renderComponents = () => (
    <div className="space-y-6">
      {Object.entries(systemComponents).map(([sectionId, section]) => (
        <div key={sectionId} className="bg-white rounded-lg shadow-sm border">
          <div 
            className="p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection(sectionId)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {section.icon}
                <h3 className="font-semibold text-gray-800">{section.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {section.components.filter(c => completedComponents.has(c.id)).length}/{section.components.length}
                </span>
                {expandedSections.has(sectionId) ? 
                  <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                }
              </div>
            </div>
          </div>

          {expandedSections.has(sectionId) && (
            <div className="p-4 space-y-3">
              {section.components.map((component) => (
                <div 
                  key={component.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => toggleComponent(component.id)}
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(component.id)}
                    <div className="flex items-center gap-2">
                      {component.icon}
                      <div>
                        <h4 className="font-medium text-gray-800">{component.name}</h4>
                        <p className="text-sm text-gray-600">{component.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                      {component.tech}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(component.priority)}`}>
                      {component.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderTimeline = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="font-semibold text-gray-800 mb-4">Development Timeline</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-red-50 rounded-lg">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div>
              <h4 className="font-medium text-red-800">Phase 1: Core Infrastructure (Weeks 1-4)</h4>
              <p className="text-sm text-red-600">Frontend, Backend, Database, Security</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div>
              <h4 className="font-medium text-yellow-800">Phase 2: Payment Integration (Weeks 5-6)</h4>
              <p className="text-sm text-yellow-600">MTN MoMo, Airtel Money, Card Processing</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div>
              <h4 className="font-medium text-blue-800">Phase 3: Hotspot Integration (Weeks 7-8)</h4>
              <p className="text-sm text-blue-600">RADIUS Server, Captive Portal, Router Compatibility</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <h4 className="font-medium text-green-800">Phase 4: Features & Testing (Weeks 9-10)</h4>
              <p className="text-sm text-green-600">SMS, Admin Tools, Testing, Documentation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderArchitecture = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="font-semibold text-gray-800 mb-4">System Architecture Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <Globe className="w-8 h-8 text-blue-600 mb-2" />
            <h4 className="font-medium text-blue-800">Frontend Layer</h4>
            <p className="text-sm text-blue-600">React/Vue.js dashboard for users and admins</p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <Server className="w-8 h-8 text-green-600 mb-2" />
            <h4 className="font-medium text-green-800">Backend Services</h4>
            <p className="text-sm text-green-600">API layer, payment processing, RADIUS</p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <Database className="w-8 h-8 text-purple-600 mb-2" />
            <h4 className="font-medium text-purple-800">Data Layer</h4>
            <p className="text-sm text-purple-600">PostgreSQL for all system data</p>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <CreditCard className="w-8 h-8 text-yellow-600 mb-2" />
            <h4 className="font-medium text-yellow-800">Payment Gateways</h4>
            <p className="text-sm text-yellow-600">MTN MoMo, Airtel Money, Card processing</p>
          </div>

          <div className="p-4 bg-red-50 rounded-lg">
            <Wifi className="w-8 h-8 text-red-600 mb-2" />
            <h4 className="font-medium text-red-800">Network Layer</h4>
            <p className="text-sm text-red-600">RADIUS, Captive Portal, Router integration</p>
          </div>

          <div className="p-4 bg-indigo-50 rounded-lg">
            <Shield className="w-8 h-8 text-indigo-600 mb-2" />
            <h4 className="font-medium text-indigo-800">Security Layer</h4>
            <p className="text-sm text-indigo-600">SSL, authentication, audit logging</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with user info and logout */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MoWave Architecture Manager</h1>
              <p className="text-gray-600">Comprehensive hotspot voucher system development tracker</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Welcome, {user?.email || user?.username || 'User'}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Track your hotspot system development progress</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'components', label: 'Components', icon: <Settings className="w-4 h-4" /> },
            { id: 'timeline', label: 'Timeline', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'architecture', label: 'Architecture', icon: <Server className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeSection === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'components' && renderComponents()}
        {activeSection === 'timeline' && renderTimeline()}
        {activeSection === 'architecture' && renderArchitecture()}
      </div>
    </div>
  );
};

export default MoWaveArchitectureApp;
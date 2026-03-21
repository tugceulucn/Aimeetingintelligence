import { Link } from 'react-router';
import { Video, MessageSquare, Users } from 'lucide-react';

const platforms = [
  {
    name: 'Zoom',
    icon: Video,
    description: 'Connect Zoom to automatically analyze all your meetings.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    name: 'Google Meet',
    icon: MessageSquare,
    description: 'Connect Google Meet to automatically analyze meetings.',
    color: 'from-green-500 to-green-600'
  },
  {
    name: 'Microsoft Teams',
    icon: Users,
    description: 'Connect Microsoft Teams for seamless meeting analysis.',
    color: 'from-purple-500 to-purple-600'
  }
];

export function Connect() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Connect Your Meeting Platform</h1>
          <p className="mt-4 text-lg text-gray-600">
            Choose a platform to get started with AI-powered meeting intelligence
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {platforms.map((platform) => (
            <div
              key={platform.name}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br ${platform.color}`}>
                <platform.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">{platform.name}</h3>
              <p className="mt-2 text-sm text-gray-600">{platform.description}</p>
              <button className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
                Connect {platform.name}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Skip for now →
          </Link>
        </div>
      </div>
    </div>
  );
}

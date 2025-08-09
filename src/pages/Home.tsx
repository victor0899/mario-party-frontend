import { Link } from 'react-router-dom';
import { Container, VideoBackground, Button } from '../components';

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Video Background */}
      <VideoBackground />
      
      {/* Content */}
      <Container maxWidth="sm" className="relative z-10 w-full">
        <div className="w-full max-w-md mx-auto p-8 flex flex-col items-center">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-mario text-white mb-2">
              Mario Party Tracker
            </h1>
            <p className="text-lg text-gray-200">Keep score, track your epic wins, and relive the chaos of every game night with friends.</p>
          </div>

          <div className="mt-8">
            <Link to="/register">
              <Button variant="primary" size="lg">
                Create an account
              </Button>
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-200">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-300 hover:text-blue-200 font-medium transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
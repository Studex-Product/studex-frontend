import { Component } from "react";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

class RouteErrorBoundaryClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Route Error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  componentDidUpdate(prevProps) {
    // Reset error state when route changes
    if (this.props.location !== prevProps.location) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-lg  p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-orange-100 rounded-full p-3">
                <AlertCircle className="w-10 h-10 text-orange-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
              Something went wrong on this page
            </h2>

            <p className="text-gray-600 text-center mb-6">
              Don't worry, the rest of the app is still working fine.
            </p>

            <div className="flex gap-3 justify-center mb-6">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>

              <button
                onClick={() => this.props.navigate(-1)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 p-4 bg-purple-100 rounded-lg transition-all duration-200 animate-collapsible-down">
                <summary className="cursor-pointer font-semibold text-gray-900 text-sm mb-2">
                  Error Details
                </summary>
                <div className="mt-3 space-y-3">
                  <div>
                    <p className="font-semibold text-xs text-gray-700 mb-1">
                      Error:
                    </p>
                    <pre className="text-xs bg-red-50 p-2 rounded overflow-auto text-red-800">
                      {this.state.error.toString()}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <p className="font-semibold text-xs text-gray-700 mb-1">
                        Stack:
                      </p>
                      <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto text-gray-800 max-h-40">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper to use React Router's useNavigate hook
function RouteErrorBoundary({ children }) {
  const navigate = useNavigate();
  const location = window.location.pathname;

  return (
    <RouteErrorBoundaryClass navigate={navigate} location={location}>
      {children}
    </RouteErrorBoundaryClass>
  );
}

export default RouteErrorBoundary;

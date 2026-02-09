import React from "react";
import AppErrorView from "./AppErrorView";

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      message: "",
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || "Runtime rendering failure",
    };
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) {
      console.error("AppErrorBoundary", error);
    }
  }

  retry = () => {
    this.setState({
      hasError: false,
      message: "",
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 md:p-6">
          <AppErrorView code={500} message={this.state.message} onRetry={this.retry} />
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;

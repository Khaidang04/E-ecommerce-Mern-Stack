import React from "react";
import { ThemeContext } from "../context/ThemeContext";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <ThemeContext.Consumer>
          {({ theme, lightColors, darkColors }) => {
            const getThemeStyles = () => {
              if (theme === "light") {
                return {
                  backgroundColor: lightColors.background,
                  color: lightColors.text,
                };
              } else if (theme === "dark") {
                return {
                  backgroundColor: darkColors.background,
                  color: darkColors.text,
                };
              } else {
                return {
                  backgroundColor: "#fff7e6",
                  color: "#4a4a4a",
                };
              }
            };

            const getErrorStyles = () => {
              if (theme === "light") {
                return { color: "#ef4444" };
              } else if (theme === "dark") {
                return { color: "#f87171" };
              } else {
                return { color: "#dc2626" };
              }
            };

            return (
              <div
                className="flex items-center justify-center min-h-screen"
                style={getThemeStyles()}
              >
                <h1 className="text-center" style={getErrorStyles()}>
                  Có lỗi xảy ra. Vui lòng thử lại.
                </h1>
              </div>
            );
          }}
        </ThemeContext.Consumer>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

#include <cstdlib>

int main() {

    // Use std::system to run the Node.js script
    int result = std::system("node dist/server.js");

    // Check the result
    if (result == 0) {
        // The Node.js script was started successfully
        // Add any additional logic here
    } else {
        // An error occurred
        // Handle the error as needed
    }

    return 0;
}

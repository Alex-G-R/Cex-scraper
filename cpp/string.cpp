
#include <iostream>
#include <fstream>
#include <string>
#include <vector>

class Game {
public:
    std::string fullName;
    std::string firstWord;
    float numericPrice;

    Game(const std::string& fullName, const std::string& firstWord, float numericPrice)
        : fullName(fullName), firstWord(firstWord), numericPrice(numericPrice) {}
};

int main() {
    std::ifstream inputFile("C:\\dev\\Cex-scraper\\data\\united_kingdom-page2-devel.txt");
    std::vector<Game> games;

    if (!inputFile.is_open()) {
        std::cerr << "Error opening the file." << std::endl;
        return 1;
    }

    std::string line;
    while (std::getline(inputFile, line)) {
        // Ignore lines starting with 'https'
        if (line.compare(0, 5, "https") == 0) {
            continue;
        }

        // Extract full name (up to the first ':')
        size_t colonPos = line.find(':');
        if (colonPos == std::string::npos) {
            // Invalid format, skip this line
            continue;
        }
        std::string fullName = line.substr(0, colonPos);

        // Extract first word
        size_t spacePos = line.find_first_of(" \t");
        std::string firstWord = (spacePos != std::string::npos) ? line.substr(0, spacePos) : line;

        // Extract last word as a string
        size_t lastSpacePos = line.find_last_of(" \t");
        std::string price = (lastSpacePos != std::string::npos) ? line.substr(lastSpacePos + 1) : line;

        // Remove the last two letters from the price
        if (price.length() >= 2) {
            price = price.substr(0, price.length() - 2);
        }

        // Convert price to a numeric value
        float numericPrice = 0.0f;
        try {
            numericPrice = std::stof(price);
        } catch (const std::exception& e) {
            // Handle conversion error if needed
            std::cerr << "Error converting price to numeric value: " << e.what() << std::endl;
        }

        // Create Game object and store in vector
        games.emplace_back(fullName, firstWord, numericPrice);
    }

    inputFile.close();

    // Save data to a text file
    std::ofstream outputFile("../output.txt");
    if (!outputFile.is_open()) {
        std::cerr << "Error opening the output file." << std::endl;
        return 1;
    }

    // Write each game's information to the text file
    for (const auto& game : games) {
        outputFile << "Full Name: " << game.fullName << std::endl;
        outputFile << "First Word: " << game.firstWord << std::endl;
        outputFile << "Numeric Price: " << game.numericPrice << std::endl;
        outputFile << "------------------------" << std::endl;
    }

    outputFile.close();

    std::cout << "Data saved to output.txt." << std::endl;

    return 0;
}

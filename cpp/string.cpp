#include <iostream>
#include <fstream>
#include <sstream>
#include <map>
#include <filesystem>
#include <cctype>

namespace fs = std::filesystem;

std::string cleanForFilename(const std::string &str)
{
    std::string result;
    for (char c : str)
    {
        if (std::isalnum(c) || c == '_')
        {
            result += c;
        }
    }
    return result;
}

void processFolders(const std::string &folder1, const std::string &folder2)
{
    std::string outputFolder = "combined";
    fs::create_directory(outputFolder);

    std::string nomatchFolder = "nomatch";
    fs::create_directory(nomatchFolder);

    std::map<std::string, std::ofstream> outputFiles;

    // Process the first folder
    for (const auto &entry : fs::directory_iterator(folder1))
    {
        if (entry.is_regular_file())
        {
            std::ifstream inputFile(entry.path());
            if (!inputFile.is_open())
            {
                std::cerr << "Error opening file: " << entry.path() << std::endl;
                continue;
            }

            std::string fileName = cleanForFilename(entry.path().filename().stem().string());
            std::string outputFilePath = outputFolder + "/" + fileName + ".txt";

            if (outputFiles.find(fileName) == outputFiles.end())
            {
                outputFiles[fileName].open(outputFilePath, std::ios::app); // open file in append mode
            }

            // Append the content with separator
            outputFiles[fileName] << inputFile.rdbuf() << "\n----------\n";

            inputFile.close();
        }
    }

    // Process the second folder
    for (const auto &entry : fs::directory_iterator(folder2))
    {
        if (entry.is_regular_file())
        {
            std::ifstream inputFile(entry.path());
            if (!inputFile.is_open())
            {
                std::cerr << "Error opening file: " << entry.path() << std::endl;
                continue;
            }

            std::string fileName = cleanForFilename(entry.path().filename().stem().string());
            std::string outputFilePath = outputFolder + "/" + fileName + ".txt";

            if (outputFiles.find(fileName) == outputFiles.end())
            {
                outputFiles[fileName].open(outputFilePath, std::ios::app); // open file in append mode
            }

            // Explicitly convert std::filesystem::path to string before concatenation
            outputFiles[fileName] << inputFile.rdbuf() << "\n----------\n";

            inputFile.close();
        }
    }

    // Close all output files
    for (auto &pair : outputFiles)
    {
        pair.second.close();
    }

    // Process files with no match
    for (const auto &entry : fs::directory_iterator(folder1))
    {
        if (entry.is_regular_file())
        {
            std::string fileName = cleanForFilename(entry.path().filename().stem().string());
            if (outputFiles.find(fileName) == outputFiles.end())
            {
                // File has no match, copy to nomatch folder
                fs::copy(entry.path(), nomatchFolder + "/" + entry.path().filename().string());
            }
        }
    }

    for (const auto &entry : fs::directory_iterator(folder2))
    {
        if (entry.is_regular_file())
        {
            std::string fileName = cleanForFilename(entry.path().filename().stem().string());
            if (outputFiles.find(fileName) == outputFiles.end())
            {
                // File has no match, copy to nomatch folder
                fs::copy(entry.path(), nomatchFolder + "/" + entry.path().filename().string());
            }
        }
    }
}

int main()
{
    std::string polishFolder = "polish";
    std::string englishFolder = "english";

    processFolders(polishFolder, englishFolder);

    std::cout << "Processing complete." << std::endl;

    return 0;
}

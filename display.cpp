#include "blood_bank.hpp"
#include <iostream>
#include <sstream>

// Simple JSON-like output without external library
std::string donorToSimpleJson(const Donor* donor) {
    std::stringstream ss;
    
    ss << "    {";
    ss << "\"name\": \"" << donor->name << "\", ";
    ss << "\"phone\": \"" << donor->phone << "\", "; // Keep raw phone number (10 digits)
    ss << "\"bloodGroup\": \"" << donor->bloodGroup << "\", ";
    ss << "\"address\": \"" << donor->address << "\", ";
    ss << "\"latitude\": " << donor->latitude << ", ";
    ss << "\"longitude\": " << donor->longitude;
    ss << "}";
    
    return ss.str();
}

int main(int argc, char* argv[]) {
    std::string bloodGroup = "all";
    if (argc == 2) {
        bloodGroup = argv[1];
        if (!Validation::isValidBloodGroup(bloodGroup) && bloodGroup != "all") {
            std::cerr << "Invalid blood group" << std::endl;
            return 1;
        }
    }
    
    BloodBank bank("donors.txt");
    bank.loadData();
    
    auto donors = bank.displayDonors(bloodGroup);
    
    // Output as simple JSON format
    std::cout << "{" << std::endl;
    std::cout << "  \"donors\": [" << std::endl;
    
    for (size_t i = 0; i < donors.size(); ++i) {
        std::cout << donorToSimpleJson(donors[i]);
        if (i < donors.size() - 1) {
            std::cout << ",";
        }
        std::cout << std::endl;
    }
    
    std::cout << "  ]," << std::endl;
    std::cout << "  \"count\": " << donors.size() << std::endl;
    std::cout << "}" << std::endl;
    
    return 0;
}
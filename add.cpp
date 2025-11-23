#include "blood_bank.hpp"
#include <iostream>
#include <sstream>

int main(int argc, char* argv[]) {
    if (argc != 7) {
        std::cerr << "Usage: " << argv[0] << " <name> <phone> <bloodGroup> <address> <latitude> <longitude>" << std::endl;
        return 1;
    }
    
    std::string name = argv[1];
    std::string phone = argv[2];
    std::string bloodGroup = argv[3];
    std::string address = argv[4];
    double latitude, longitude;
    
    try {
        latitude = std::stod(argv[5]);
        longitude = std::stod(argv[6]);
    } catch (const std::exception& e) {
        std::cerr << "Invalid coordinates: " << e.what() << std::endl;
        return 1;
    }
    
    // Validate inputs
    if (!Validation::isValidName(name) ||
        !Validation::isValidPhone(phone) ||
        !Validation::isValidBloodGroup(bloodGroup) ||
        !Validation::isValidCoordinate(latitude, longitude)) {
        std::cerr << "Invalid input data" << std::endl;
        return 1;
    }
    
    BloodBank bank("donors.txt");
    
    if (bank.addDonor(name, phone, bloodGroup, address, latitude, longitude)) {
        bank.saveAllData();
        std::cout << "Donor added successfully" << std::endl;
        return 0;
    } else {
        std::cerr << "Failed to add donor - phone number may already exist" << std::endl;
        return 1;
    }
}
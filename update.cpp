#include "blood_bank.hpp"
#include <iostream>

int main(int argc, char* argv[]) {
    if (argc != 5) {
        std::cerr << "Usage: " << argv[0] << " <oldPhone> <bloodGroup> <newAddress> <newPhone>" << std::endl;
        std::cerr << "Received " << argc-1 << " arguments:" << std::endl;
        for (int i = 1; i < argc; i++) {
            std::cerr << "  Arg " << i << ": " << argv[i] << std::endl;
        }
        return 1;
    }

    std::string oldPhone = argv[1];
    std::string bloodGroup = argv[2];
    std::string newAddress = argv[3];
    std::string newPhone = argv[4];

    std::cout << "Update Donor Parameters:" << std::endl;
    std::cout << "Old Phone: " << oldPhone << std::endl;
    std::cout << "Blood Group: " << bloodGroup << std::endl;
    std::cout << "New Address: " << newAddress << std::endl;
    std::cout << "New Phone: " << newPhone << std::endl;

    // Validate inputs
    if (!Validation::isValidPhone(oldPhone)) {
        std::cerr << "Invalid old phone number: " << oldPhone << std::endl;
        return 1;
    }
    if (!Validation::isValidBloodGroup(bloodGroup)) {
        std::cerr << "Invalid blood group: " << bloodGroup << std::endl;
        return 1;
    }
    if (!Validation::isValidPhone(newPhone)) {
        std::cerr << "Invalid new phone number: " << newPhone << std::endl;
        return 1;
    }
    if (newAddress.empty()) {
        std::cerr << "New address cannot be empty" << std::endl;
        return 1;
    }

    BloodBank bank("donors.txt");
    bank.loadData();

    if (bank.updateDonor(oldPhone, bloodGroup, newAddress, newPhone)) {
        bank.saveAllData();
        std::cout << "Donor updated successfully" << std::endl;
        return 0;
    } else {
        std::cerr << "Donor not found or update failed" << std::endl;
        return 1;
    }
}
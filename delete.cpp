#include "blood_bank.hpp"
#include <iostream>

int main(int argc, char* argv[]) {
    if (argc != 3) {
        std::cerr << "Usage: " << argv[0] << " <phone> <bloodGroup>" << std::endl;
        return 1;
    }
    
    std::string phone = argv[1];
    std::string bloodGroup = argv[2];
    
    if (!Validation::isValidPhone(phone) || !Validation::isValidBloodGroup(bloodGroup)) {
        std::cerr << "Invalid input data" << std::endl;
        return 1;
    }
    
    BloodBank bank("donors.txt");
    bank.loadData();
    
    if (bank.deleteDonor(phone, bloodGroup)) {
        bank.saveAllData();
        std::cout << "Donor deleted successfully" << std::endl;
        return 0;
    } else {
        std::cerr << "Donor not found or deletion failed" << std::endl;
        return 1;
    }
}
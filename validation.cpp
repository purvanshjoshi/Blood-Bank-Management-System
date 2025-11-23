#include "blood_bank.hpp"
#include <regex>
#include <cctype>

namespace Validation {
    bool isValidName(const std::string& name) {
        if (name.empty() || name.length() > 100) return false;
        
        // Check if name contains only letters, spaces, and common punctuation
        for (char c : name) {
            if (!std::isalpha(c) && c != ' ' && c != '.' && c != '-' && c != '\'') {
                return false;
            }
        }
        return true;
    }
    
    bool isValidPhone(const std::string& phone) {
        // Simple phone validation - exactly 10 digits
        std::regex phoneRegex(R"(\d{10})");
        return std::regex_match(phone, phoneRegex);
    }
    
    bool isValidBloodGroup(const std::string& bloodGroup) {
        const std::vector<std::string> validGroups = {
            "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
        };
        return std::find(validGroups.begin(), validGroups.end(), bloodGroup) != validGroups.end();
    }
    
    bool isValidCoordinate(double lat, double lon) {
        return (lat >= -90.0 && lat <= 90.0 && lon >= -180.0 && lon <= 180.0);
    }
}
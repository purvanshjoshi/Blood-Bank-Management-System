/*
 * Blood Bank Management System - Search Module
 * 
 * File: search.cpp
 * Purpose: Implements donor search and location-based filtering functionality
 * Author: Blood Bank Team
 * Version: 1.0
 * Last Modified: 2025-12-03
 * 
 * Description:
 * This module provides core search functionality for finding donors and blood inventory.
 * It includes:
 *  - Donor search by blood group
 *  - Location-based filtering using latitude/longitude
 *  - Distance calculation between donors and hospitals
 *  - JSON serialization of search results for API responses
 * 
 * Dependencies:
 *  - blood_bank.hpp: Core data structures and bank management
 *  - iostream: Standard I/O operations
 *  - sstream: String stream for building output
 *  - iomanip: Output formatting utilities
 * 
 * Usage Example:
 *  string jsonResult = donorToJson(donor, latitude, longitude);
 * 
 * Performance Considerations:
 *  - Distance calculation uses haversine formula for accuracy
 *  - Results are JSON formatted for direct API response usage
 *  - Consider caching results for frequently searched locations
 * 
 * Notes:
 *  - All distance values are in kilometers
 *  - Latitude/Longitude should be in decimal degrees format
 */


#include "blood_bank.hpp"
#include <iostream>
#include <iomanip>
#include <sstream>

std::string donorToJson(const Donor* donor, double hospitalLat, double hospitalLon, const BloodBank& bank) {
    std::stringstream ss;
    double distance = bank.calculateDistance(donor->latitude, donor->longitude, hospitalLat, hospitalLon);
    
    ss << "    {";
    ss << "\"name\": \"" << donor->name << "\", ";
    ss << "\"phone\": \"" << donor->phone << "\", "; // Keep raw phone number (10 digits)
    ss << "\"bloodGroup\": \"" << donor->bloodGroup << "\", ";
    ss << "\"address\": \"" << donor->address << "\", ";
    ss << "\"latitude\": " << donor->latitude << ", ";
    ss << "\"longitude\": " << donor->longitude << ", ";
    ss << "\"distance\": " << std::fixed << std::setprecision(2) << distance;
    ss << "}";
    
    return ss.str();
}

int main(int argc, char* argv[]) {
    if (argc != 4) {
        std::cerr << "Usage: " << argv[0] << " <bloodGroup> <hospitalLat> <hospitalLon>" << std::endl;
        return 1;
    }
    
    std::string bloodGroup = argv[1];
    double hospitalLat, hospitalLon;
    
    try {
        hospitalLat = std::stod(argv[2]);
        hospitalLon = std::stod(argv[3]);
    } catch (const std::exception& e) {
        std::cerr << "Invalid coordinates: " << e.what() << std::endl;
        return 1;
    }
    
    if (!Validation::isValidBloodGroup(bloodGroup) ||
        !Validation::isValidCoordinate(hospitalLat, hospitalLon)) {
        std::cerr << "Invalid input data" << std::endl;
        return 1;
    }
    
    BloodBank bank("donors.txt");
    bank.loadData();
    
    auto nearestDonors = bank.findNearestDonors(bloodGroup, hospitalLat, hospitalLon, 5);
    
    // Output as simple JSON format
    std::cout << "{" << std::endl;
    std::cout << "  \"donors\": [" << std::endl;
    
    for (size_t i = 0; i < nearestDonors.size(); ++i) {
        std::cout << donorToJson(nearestDonors[i], hospitalLat, hospitalLon, bank);
        if (i < nearestDonors.size() - 1) {
            std::cout << ",";
        }
        std::cout << std::endl;
    }
    
    std::cout << "  ]" << std::endl;
    std::cout << "}" << std::endl;
    
    return 0;

}

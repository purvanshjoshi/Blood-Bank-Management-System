#ifndef BLOODBANK_HPP
#define BLOODBANK_HPP

#include <iostream>
#include <string>
#include <fstream>
#include <vector>
#include <algorithm>
#include <cmath>
#include <stdexcept>
#include <memory>

// Define M_PI if not already defined
#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

#ifdef _MSC_VER
#define _USE_MATH_DEFINES
#include <math.h>
#else
#include <cmath>
#endif

struct Donor {
    std::string name;
    std::string phone;
    std::string bloodGroup;
    std::string address;
    double latitude;
    double longitude;
    Donor* left;
    Donor* right;
    
    Donor(const std::string& n, const std::string& p, const std::string& bg,
          const std::string& addr, double lat, double lon)
        : name(n), phone(p), bloodGroup(bg), address(addr),
          latitude(lat), longitude(lon), left(nullptr), right(nullptr) {}
};

class BloodBank {
private:
    std::string dataFile;
    
    // Binary Search Trees for each blood group
    Donor* A_positive;
    Donor* A_negative;
    Donor* B_positive;
    Donor* B_negative;
    Donor* AB_positive;
    Donor* AB_negative;
    Donor* O_positive;
    Donor* O_negative;
    
    // Non-const version for internal use
    Donor*& getTreeForBloodGroup(const std::string& bloodGroup);
    
    // Const version for const member functions
    Donor* getTreeForBloodGroup(const std::string& bloodGroup) const;
    
    Donor* insertBST(Donor* root, Donor* newDonor);
    Donor* deleteBST(Donor* root, const std::string& phone);
    Donor* searchBST(Donor* root, const std::string& phone) const;
    void inOrderTraversal(Donor* root, std::vector<Donor*>& result) const;
    void saveToFileBST(Donor* root, std::ofstream& file) const;
    void clearBST(Donor* root);
    
    // Helper function to check if phone exists in any blood group
    bool isPhoneNumberExists(const std::string& phone) const;
    
public:
    BloodBank(const std::string& filename);
    ~BloodBank();
    double calculateDistance(double lat1, double lon1, double lat2, double lon2) const;
    
    bool addDonor(const std::string& name, const std::string& phone,
                  const std::string& bloodGroup, const std::string& address,
                  double latitude, double longitude);
    bool deleteDonor(const std::string& phone, const std::string& bloodGroup);
    bool updateDonor(const std::string& phone, const std::string& bloodGroup,
                     const std::string& newAddress, const std::string& newPhone);
    Donor* searchDonor(const std::string& phone, const std::string& bloodGroup) const;
    std::vector<Donor*> findNearestDonors(const std::string& bloodGroup,
                                         double hospitalLat, double hospitalLon,
                                         int maxResults = 5) const;
    std::vector<Donor*> displayDonors(const std::string& bloodGroup = "all") const;
    void saveAllData();
    void loadData();
};

// Validation functions
namespace Validation {
    bool isValidName(const std::string& name);
    bool isValidPhone(const std::string& phone);
    bool isValidBloodGroup(const std::string& bloodGroup);
    bool isValidCoordinate(double lat, double lon);
}

#endif
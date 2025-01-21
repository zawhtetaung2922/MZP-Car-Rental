package com.mzp.carrental.repository.agency;


import com.mzp.carrental.entity.Cars.Car;
import com.mzp.carrental.entity.Users.Agency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CarRepo extends JpaRepository<Car, Long> {

    // Find all cars belonging to an agency
    List<Car> findByAgency(Agency agency);

    // Find a car by ID and agency
    Optional<Car> findByIdAndAgency(Long id, Agency agency);



    // Car View Controller ----------------Public ----------------------------
    // Example custom query for filtering
    @Query("SELECT c FROM Car c WHERE " +
            "(:brand IS NULL OR c.brand = :brand) AND " +
            "(:model IS NULL OR c.model = :model) AND " +
            "(:seats IS NULL OR c.seats = :seats) AND " +
            "(:category IS NULL OR c.category = :category) AND " +
            "(:fuelType IS NULL OR c.fuelType = :fuelType)")
    List<Car> findByFilters(@Param("brand") String brand,
                            @Param("model") String model,
                            @Param("seats") Integer seats,
                            @Param("category") String category,
                            @Param("fuelType") String fuelType);
}

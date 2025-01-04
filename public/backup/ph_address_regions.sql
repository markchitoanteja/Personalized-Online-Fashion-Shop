-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 04, 2025 at 04:33 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `ph_address_regions`
--

CREATE TABLE `ph_address_regions` (
  `id` int(11) NOT NULL,
  `region_code` varchar(255) DEFAULT NULL,
  `region_description` text DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `ph_address_regions`
--

INSERT INTO `ph_address_regions` (`id`, `region_code`, `region_description`) VALUES
(1, '01', 'REGION I (ILOCOS REGION)'),
(2, '02', 'REGION II (CAGAYAN VALLEY)'),
(3, '03', 'REGION III (CENTRAL LUZON)'),
(4, '04', 'REGION IV-A (CALABARZON)'),
(5, '17', 'REGION IV-B (MIMAROPA)'),
(6, '05', 'REGION V (BICOL REGION)'),
(7, '06', 'REGION VI (WESTERN VISAYAS)'),
(8, '07', 'REGION VII (CENTRAL VISAYAS)'),
(9, '08', 'REGION VIII (EASTERN VISAYAS)'),
(10, '09', 'REGION IX (ZAMBOANGA PENINSULA)'),
(11, '10', 'REGION X (NORTHERN MINDANAO)'),
(12, '11', 'REGION XI (DAVAO REGION)'),
(13, '12', 'REGION XII (SOCCSKSARGEN)'),
(14, '13', 'NATIONAL CAPITAL REGION (NCR)'),
(15, '14', 'CORDILLERA ADMINISTRATIVE REGION (CAR)'),
(16, '15', 'AUTONOMOUS REGION IN MUSLIM MINDANAO (ARMM)'),
(17, '16', 'REGION XIII (Caraga)');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ph_address_regions`
--
ALTER TABLE `ph_address_regions`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ph_address_regions`
--
ALTER TABLE `ph_address_regions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

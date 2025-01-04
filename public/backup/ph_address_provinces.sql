-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 04, 2025 at 04:32 PM
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
-- Table structure for table `ph_address_provinces`
--

CREATE TABLE `ph_address_provinces` (
  `id` int(11) NOT NULL,
  `region_code` varchar(255) DEFAULT NULL,
  `province_code` varchar(255) DEFAULT NULL,
  `province_description` text DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `ph_address_provinces`
--

INSERT INTO `ph_address_provinces` (`id`, `region_code`, `province_code`, `province_description`) VALUES
(1, '01', '0128', 'ILOCOS NORTE'),
(2, '01', '0129', 'ILOCOS SUR'),
(3, '01', '0133', 'LA UNION'),
(4, '01', '0155', 'PANGASINAN'),
(5, '02', '0209', 'BATANES'),
(6, '02', '0215', 'CAGAYAN'),
(7, '02', '0231', 'ISABELA'),
(8, '02', '0250', 'NUEVA VIZCAYA'),
(9, '02', '0257', 'QUIRINO'),
(10, '03', '0308', 'BATAAN'),
(11, '03', '0314', 'BULACAN'),
(12, '03', '0349', 'NUEVA ECIJA'),
(13, '03', '0354', 'PAMPANGA'),
(14, '03', '0369', 'TARLAC'),
(15, '03', '0371', 'ZAMBALES'),
(16, '03', '0377', 'AURORA'),
(17, '04', '0410', 'BATANGAS'),
(18, '04', '0421', 'CAVITE'),
(19, '04', '0434', 'LAGUNA'),
(20, '04', '0456', 'QUEZON'),
(21, '04', '0458', 'RIZAL'),
(22, '17', '1740', 'MARINDUQUE'),
(23, '17', '1751', 'OCCIDENTAL MINDORO'),
(24, '17', '1752', 'ORIENTAL MINDORO'),
(25, '17', '1753', 'PALAWAN'),
(26, '17', '1759', 'ROMBLON'),
(27, '05', '0505', 'ALBAY'),
(28, '05', '0516', 'CAMARINES NORTE'),
(29, '05', '0517', 'CAMARINES SUR'),
(30, '05', '0520', 'CATANDUANES'),
(31, '05', '0541', 'MASBATE'),
(32, '05', '0562', 'SORSOGON'),
(33, '06', '0604', 'AKLAN'),
(34, '06', '0606', 'ANTIQUE'),
(35, '06', '0619', 'CAPIZ'),
(36, '06', '0630', 'ILOILO'),
(37, '06', '0645', 'NEGROS OCCIDENTAL'),
(38, '06', '0679', 'GUIMARAS'),
(39, '07', '0712', 'BOHOL'),
(40, '07', '0722', 'CEBU'),
(41, '07', '0746', 'NEGROS ORIENTAL'),
(42, '07', '0761', 'SIQUIJOR'),
(43, '08', '0826', 'EASTERN SAMAR'),
(44, '08', '0837', 'LEYTE'),
(45, '08', '0848', 'NORTHERN SAMAR'),
(46, '08', '0860', 'SAMAR (WESTERN SAMAR)'),
(47, '08', '0864', 'SOUTHERN LEYTE'),
(48, '08', '0878', 'BILIRAN'),
(49, '09', '0972', 'ZAMBOANGA DEL NORTE'),
(50, '09', '0973', 'ZAMBOANGA DEL SUR'),
(51, '09', '0983', 'ZAMBOANGA SIBUGAY'),
(52, '09', '0997', 'CITY OF ISABELA'),
(53, '10', '1013', 'BUKIDNON'),
(54, '10', '1018', 'CAMIGUIN'),
(55, '10', '1035', 'LANAO DEL NORTE'),
(56, '10', '1042', 'MISAMIS OCCIDENTAL'),
(57, '10', '1043', 'MISAMIS ORIENTAL'),
(58, '11', '1123', 'DAVAO DEL NORTE'),
(59, '11', '1124', 'DAVAO DEL SUR'),
(60, '11', '1125', 'DAVAO ORIENTAL'),
(61, '11', '1182', 'COMPOSTELA VALLEY'),
(62, '11', '1186', 'DAVAO OCCIDENTAL'),
(63, '12', '1247', 'COTABATO (NORTH COTABATO)'),
(64, '12', '1263', 'SOUTH COTABATO'),
(65, '12', '1265', 'SULTAN KUDARAT'),
(66, '12', '1280', 'SARANGANI'),
(67, '12', '1298', 'COTABATO CITY'),
(68, '13', '1339', 'NCR, CITY OF MANILA, FIRST DISTRICT'),
(69, '13', '1339', 'CITY OF MANILA'),
(70, '13', '1374', 'NCR, SECOND DISTRICT'),
(71, '13', '1375', 'NCR, THIRD DISTRICT'),
(72, '13', '1376', 'NCR, FOURTH DISTRICT'),
(73, '14', '1401', 'ABRA'),
(74, '14', '1411', 'BENGUET'),
(75, '14', '1427', 'IFUGAO'),
(76, '14', '1432', 'KALINGA'),
(77, '14', '1444', 'MOUNTAIN PROVINCE'),
(78, '14', '1481', 'APAYAO'),
(79, '15', '1507', 'BASILAN'),
(80, '15', '1536', 'LANAO DEL SUR'),
(81, '15', '1538', 'MAGUINDANAO'),
(82, '15', '1566', 'SULU'),
(83, '15', '1570', 'TAWI-TAWI'),
(84, '16', '1602', 'AGUSAN DEL NORTE'),
(85, '16', '1603', 'AGUSAN DEL SUR'),
(86, '16', '1667', 'SURIGAO DEL NORTE'),
(87, '16', '1668', 'SURIGAO DEL SUR'),
(88, '16', '1685', 'DINAGAT ISLANDS');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ph_address_provinces`
--
ALTER TABLE `ph_address_provinces`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ph_address_provinces`
--
ALTER TABLE `ph_address_provinces`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

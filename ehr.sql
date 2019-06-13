-- MySQL   Distrib 5.7.26, for Linux (x86_64)
--
-- Host: localhost    Database: ehrdb
-- ------------------------------------------------------
-- Server version	5.7.26-0ubuntu0.18.04.1


--
-- Table structure for table `relation`
--
DROP DATABASE IF EXISTS `ehrdb`;
CREATE DATABASE `ehrdb`;
USE `ehrdb`;

DROP TABLE IF EXISTS `relation`;
CREATE TABLE `relation` (
  `issuer` varchar(255)  NOT NULL,
  `pname` varchar(255) NOT NULL,
  `ehrid` varchar(255) NOT NULL,
  `issueDateTime` varchar(255) NOT NULL,
  `flag` int(255) DEFAULT '0'
) ENGINE=InnoDB;

--
-- Table structure for table `user`
--
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `userID` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `identity` varchar(255) NOT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=1;

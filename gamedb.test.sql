DROP DATABASE IF EXISTS `gamedb_test`;
CREATE DATABASE `gamedb_test`;
USE `gamedb_test`;

-- gamedb_test_user aanmaken
CREATE USER 'gamedb_test_user'@'%' IDENTIFIED BY 'secret';
CREATE USER 'gamedb_test_user'@'localhost' IDENTIFIED BY 'secret';

-- geef in een keer alle rechten - soort administrator!
GRANT ALL ON `gamedb_test`.* TO 'gamedb_test_user'@'%';
GRANT ALL ON `gamedb_test`.* TO 'gamedb_test_user'@'localhost';


-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------

DROP TABLE IF EXISTS `users` ;
CREATE TABLE IF NOT EXISTS `users` (
	`ID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`firstname` VARCHAR(32) NOT NULL,
	`lastname` VARCHAR(64) NOT NULL,
	`email` VARCHAR(64) NOT NULL UNIQUE,
	`password` VARCHAR(32) NOT NULL,
	`lastupdated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`ID`)
) 
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `producer`
-- -----------------------------------------------------

DROP TABLE IF EXISTS `producer` ;
CREATE TABLE IF NOT EXISTS `producer` (
	`ID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(32) NOT NULL,
	`description` VARCHAR(32) NOT NULL,
	`userID` INT UNSIGNED NOT NULL,
	`lastupdated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`ID`)
) 
ENGINE = InnoDB;

ALTER TABLE `producer` 
ADD CONSTRAINT `fk_producer_user`
FOREIGN KEY (`userID`) REFERENCES `users` (`ID`)
ON DELETE NO ACTION
ON UPDATE CASCADE;

-- -----------------------------------------------------
-- Table `games`
-- -----------------------------------------------------

DROP TABLE IF EXISTS `games` ;
CREATE TABLE IF NOT EXISTS `games` (
	`ID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`title` VARCHAR(32) NOT NULL,
	`year` INT UNSIGNED NOT NULL,
	`type` ENUM(
		'FIRST_PERSON_SHOOTER',
		'THIRD_PERSON_SHOOTER',
		'ADVENTURE','PUZZLE',
		'COMBAT',
		'UNKNOWN'
	) NOT NULL DEFAULT 'UNKNOWN',
	`producerID` INT UNSIGNED NOT NULL,
	`userID` INT UNSIGNED NOT NULL,
	`lastupdated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`ID`)
) 
ENGINE = InnoDB;

ALTER TABLE `games` 
ADD CONSTRAINT `fk_game_producer`
FOREIGN KEY (`producerID`) REFERENCES `producer` (`ID`)
ON DELETE NO ACTION
ON UPDATE CASCADE,

ADD CONSTRAINT `fk_game_user`
FOREIGN KEY (`userID`) REFERENCES `users` (`ID`)
ON DELETE NO ACTION
ON UPDATE CASCADE;

-- -----------------------------------------------------
-- Insert values
-- -----------------------------------------------------
INSERT INTO `users` (`firstname`, `lastname`, `email`, `password`) VALUES 
('user-1', 'name-1', 'user1@server.nl', 'secret'),
('user-2', 'name-2', 'user2@server.nl', 'secret'),
('user-3', 'name-3', 'user3@server.nl', 'secret'),
('user-4', 'name-4', 'user4@server.nl', 'secret');

INSERT INTO `producer` (`name`, `description`, `userID`) VALUES
('EA', 'Description.', 1),
('Epic Games', 'Description.', 2),
('Mojang AB', 'Description.', 3);

INSERT INTO `games` (`title`, `year`, `type`, `producerID`, `userID`) VALUES
('Battlefield 5', 2018, 'FIRST_PERSON_SHOOTER', 1, 1),
('Fortnite', 2017, 'THIRD_PERSON_SHOOTER', 2, 2),
('Minecraft', 2009, 'ADVENTURE', 3, 2);
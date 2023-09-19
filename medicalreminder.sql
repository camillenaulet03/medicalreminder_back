-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : sam. 09 sep. 2023 à 09:10
-- Version du serveur : 5.7.19
-- Version de PHP : 7.4.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `medicalreminder`
--

-- --------------------------------------------------------

--
-- Structure de la table `appointment`
--

CREATE TABLE `appointment` (
  `id` int(11) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `comment` text NOT NULL,
  `state` varchar(100) NOT NULL,
  `id_practitioner` int(11) NOT NULL,
  `id_patient` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `assistant`
--

CREATE TABLE `assistant` (
  `id_practitioner` int(11) NOT NULL,
  `id_assistant` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `permission`
--

CREATE TABLE `permission` (
  `id` int(11) NOT NULL,
  `permission` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `reminder`
--

CREATE TABLE `reminder` (
  `id` int(11) NOT NULL,
  `content` text NOT NULL,
  `date` datetime NOT NULL,
  `frequency` varchar(50) NOT NULL,
  `id_patient` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `rolepermission`
--

CREATE TABLE `rolepermission` (
  `id_role` int(11) NOT NULL,
  `id_permission` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `sharedcalendar`
--

CREATE TABLE `sharedcalendar` (
  `id_practitioner` int(11) NOT NULL,
  `id_patient` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `phone` varchar(12) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` text NOT NULL,
  `missed_appointments` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `id_role` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `userrole`
--

CREATE TABLE `userrole` (
  `id` int(11) NOT NULL,
  `role` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `userrole`
--

INSERT INTO `userrole` (`id`, `role`) VALUES
(1, 'admin'),
(2, 'médecin'),
(3, 'dentiste'),
(4, 'assistant'),
(5, 'patient');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `appointment`
--
ALTER TABLE `appointment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_practitioner` (`id_practitioner`),
  ADD KEY `id_patient2` (`id_patient`) USING BTREE;

--
-- Index pour la table `assistant`
--
ALTER TABLE `assistant`
  ADD KEY `id_practitioner2` (`id_practitioner`),
  ADD KEY `id_assistant` (`id_assistant`) USING BTREE;

--
-- Index pour la table `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `reminder`
--
ALTER TABLE `reminder`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_patient` (`id_patient`);

--
-- Index pour la table `rolepermission`
--
ALTER TABLE `rolepermission`
  ADD KEY `id_role` (`id_role`),
  ADD KEY `id_permission` (`id_permission`);

--
-- Index pour la table `sharedcalendar`
--
ALTER TABLE `sharedcalendar`
  ADD KEY `id_practitioner1` (`id_practitioner`),
  ADD KEY `id_patient1` (`id_patient`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_email` (`email`),
  ADD KEY `id_role1` (`id_role`);

--
-- Index pour la table `userrole`
--
ALTER TABLE `userrole`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `appointment`
--
ALTER TABLE `appointment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `permission`
--
ALTER TABLE `permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `reminder`
--
ALTER TABLE `reminder`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `userrole`
--
ALTER TABLE `userrole`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `appointment`
--
ALTER TABLE `appointment`
  ADD CONSTRAINT `id_patient2` FOREIGN KEY (`id_patient`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `id_practitioner` FOREIGN KEY (`id_practitioner`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `assistant`
--
ALTER TABLE `assistant`
  ADD CONSTRAINT `id_patient3` FOREIGN KEY (`id_assistant`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `id_practitioner2` FOREIGN KEY (`id_practitioner`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `reminder`
--
ALTER TABLE `reminder`
  ADD CONSTRAINT `id_patient` FOREIGN KEY (`id_patient`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `rolepermission`
--
ALTER TABLE `rolepermission`
  ADD CONSTRAINT `id_permission` FOREIGN KEY (`id_permission`) REFERENCES `permission` (`id`),
  ADD CONSTRAINT `id_role` FOREIGN KEY (`id_role`) REFERENCES `userrole` (`id`);

--
-- Contraintes pour la table `sharedcalendar`
--
ALTER TABLE `sharedcalendar`
  ADD CONSTRAINT `id_patient1` FOREIGN KEY (`id_patient`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `id_practitioner1` FOREIGN KEY (`id_practitioner`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `id_role1` FOREIGN KEY (`id_role`) REFERENCES `userrole` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

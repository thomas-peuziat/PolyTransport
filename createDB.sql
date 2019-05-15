------------------------------------------------------------
--        Script SQLite
------------------------------------------------------------


------------------------------------------------------------
-- Table: LIEU
------------------------------------------------------------
CREATE TABLE LIEU(
	Id_lieu       INTEGER NOT NULL ,
	Ville         TEXT NOT NULL ,
	Complement    TEXT NOT NULL,
	CONSTRAINT LIEU_PK PRIMARY KEY (Id_lieu)
);


------------------------------------------------------------
-- Table: VEHICULE
------------------------------------------------------------
CREATE TABLE VEHICULE(
	Id_vehicule    INTEGER NOT NULL ,
	Marque         TEXT NOT NULL ,
	Modele         TEXT NOT NULL ,
	Annee          NUMERIC NOT NULL ,
	Image          BLOB NOT NULL,
	CONSTRAINT VEHICULE_PK PRIMARY KEY (Id_vehicule)
);


------------------------------------------------------------
-- Table: UTILISATEUR
------------------------------------------------------------
CREATE TABLE UTILISATEUR(
	Id_usr         INTEGER NOT NULL ,
	Telephone      TEXT NOT NULL ,
	Mail           TEXT NOT NULL ,
	Nom            TEXT NOT NULL ,
	Prenom         TEXT NOT NULL ,
	DDN            NUMERIC NOT NULL ,
	Note           REAL ,
	MDP            TEXT NOT NULL ,
	Image          BLOB NOT NULL ,
	Id_vehicule    INTEGER NOT NULL,
	CONSTRAINT UTILISATEUR_PK PRIMARY KEY (Id_usr)

	,CONSTRAINT UTILISATEUR_VEHICULE_FK FOREIGN KEY (Id_vehicule) REFERENCES VEHICULE(Id_vehicule)
);


------------------------------------------------------------
-- Table: TRAJET
------------------------------------------------------------
CREATE TABLE TRAJET(
	Id_trajet             INTEGER NOT NULL ,
	Etat                  INTEGER NOT NULL ,
	Note                  INTEGER ,
	Commentaire           TEXT ,
	Kilometres            INTEGER NOT NULL ,
	Prix                  REAL NOT NULL ,
	Etat_payement         INTEGER NOT NULL ,
	Id_paypal_paiement    TEXT NOT NULL ,
	Heure                 NUMERIC NOT NULL ,
	Heure_Arrivee         NUMERIC NOT NULL ,
	Id_lieu_depart        INTEGER NOT NULL ,
	Id_lieu_arrivee       INTEGER NOT NULL ,
	Id_conducteur         INTEGER NOT NULL,
	CONSTRAINT TRAJET_PK PRIMARY KEY (Id_trajet)

	,CONSTRAINT TRAJET_LIEU_FK FOREIGN KEY (Id_lieu_depart) REFERENCES LIEU(Id_lieu)
	,CONSTRAINT TRAJET_LIEU0_FK FOREIGN KEY (Id_lieu_arrivee) REFERENCES LIEU(Id_lieu)
	,CONSTRAINT TRAJET_UTILISATEUR1_FK FOREIGN KEY (Id_conducteur) REFERENCES UTILISATEUR(Id_usr)
);


------------------------------------------------------------
-- Table: Message
------------------------------------------------------------
CREATE TABLE Message(
	Id_usr_expediteur     	INTEGER NOT NULL ,
	Id_usr_destinataire    	INTEGER NOT NULL ,
	Message_text            TEXT NOT NULL,
	CONSTRAINT Message_PK PRIMARY KEY (Id_usr_expediteur,Id_usr_destinataire)

	,CONSTRAINT Message_UTILISATEUR_FK FOREIGN KEY (Id_usr_expediteur) REFERENCES UTILISATEUR(Id_usr)
	,CONSTRAINT Message_UTILISATEUR0_FK FOREIGN KEY (Id_usr_destinataire) REFERENCES UTILISATEUR(Id_usr)
);


------------------------------------------------------------
-- Table: Passager
------------------------------------------------------------
CREATE TABLE Passager(
	Id_usr       INTEGER NOT NULL ,
	Id_trajet    INTEGER NOT NULL,
	CONSTRAINT Passager_PK PRIMARY KEY (Id_usr,Id_trajet)

	,CONSTRAINT Passager_UTILISATEUR_FK FOREIGN KEY (Id_usr) REFERENCES UTILISATEUR(Id_usr)
	,CONSTRAINT Passager_TRAJET0_FK FOREIGN KEY (Id_trajet) REFERENCES TRAJET(Id_trajet)
);



CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role ENUM('utilisateur', 'admin') DEFAULT 'utilisateur',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE livres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    auteur VARCHAR(255) NOT NULL,
    description TEXT,
    annee_publication YEAR,
    genre VARCHAR(100),
    isbn VARCHAR(20) UNIQUE,
    est_emprunte BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE emprunts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT,
    livre_id INT,
    date_emprunt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_retour_prevue DATE,
    date_retour_effective DATE DEFAULT NULL,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (livre_id) REFERENCES livres(id) ON DELETE CASCADE
);


CREATE TABLE historique_emprunts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT,
    livre_id INT,
    date_emprunt TIMESTAMP,
    date_retour DATE,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id),
    FOREIGN KEY (livre_id) REFERENCES livres(id)
);


INSERT INTO livres (titre, auteur, description, annee_publication, genre, isbn, est_emprunte) VALUES
('Le Petit Prince', 'Antoine de Saint-Exupéry', 'Un conte philosophique sur un petit prince voyageant entre les planètes.', 1943, 'Fiction', '9782070408504', FALSE),
('1984', 'George Orwell', 'Un roman dystopique décrivant un monde sous surveillance totale.', 1949, 'Science-fiction', '9780451524935', FALSE),
('Les Misérables', 'Victor Hugo', 'Une histoire émouvante de rédemption et d\'injustice sociale.', 1862, 'Roman historique', '9782253004226', TRUE),
('L\'Étranger', 'Albert Camus', 'Un roman philosophique abordant l\'absurde et l\'existentialisme.', 1942, 'Philosophie', '9782070360024', TRUE);

select* from livres;
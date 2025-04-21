import db from "../db.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Query to get the total number of books
    const [booksResult] = await db.query(
      "SELECT COUNT(*) AS numberOfBooks FROM livres"
    );

    // Query to get the total number of users
    const [usersResult] = await db.query(
      "SELECT COUNT(*) AS numberOfUsers FROM utilisateurs"
    );

    // Query to get the number of users who have borrowed books
    const [borrowedUsersResult] = await db.query(`
      SELECT COUNT(DISTINCT utilisateur_id) AS usersWhoBorrowedBooks
      FROM emprunts
    `);

    // Destructuring the results from queries
    const numberOfBooks = booksResult[0].numberOfBooks;
    const numberOfUsers = usersResult[0].numberOfUsers;
    const usersWhoBorrowedBooks = borrowedUsersResult[0].usersWhoBorrowedBooks;

    // Return the stats as JSON response
    res.json({
      numberOfBooks,
      numberOfUsers,
      usersWhoBorrowedBooks,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

module.exports = {
  categoryWithChildren: `
  WITH RECURSIVE subcategories AS (
    SELECT id FROM categories WHERE id = ?
    UNION ALL
    SELECT c.id FROM subcategories
    INNER JOIN categories c ON c.parentId = subcategories.id
)
SELECT id FROM subcategories;
`,
};

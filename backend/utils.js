function modifyQuery(query) {
    // Check if the query is wrapped inside ```sql ... ```
    if (query.startsWith('```sql') && query.endsWith('```')) {
        // Remove the ```sql and ending ```
        query = query.slice(6, -3).trim();
    }

    // Remove newline characters
    query = query.replace(/\n/g, ' ');

    // Ensure spaces around uppercase SQL clauses (exact word matches only)
    const sqlClauses = [
        'SELECT', 'FROM', 'JOIN', 'ON', 'WHERE', 'GROUP BY', 'ORDER BY', 'AND', 'OR', 'AS', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'OUTER JOIN'
    ];

    // Add spaces around SQL clauses but match full words only
    sqlClauses.forEach(clause => {
        const regex = new RegExp(`\\s*\\b${clause}\\b\\s*`, 'g');
        query = query.replace(regex, ` ${clause} `);
    });

    // Clean up multiple spaces to just a single space
    query = query.replace(/\s+/g, ' ').trim();

    // Add a semicolon at the end if it doesn't already exist
    if (!query.endsWith(';')) {
        query += ';';
    }

    return query;
}

function queryExtractor(obj) {
    // Remove newline characters
    if (Array.isArray(obj.parts) && obj.parts.length > 0) {
        query = obj.parts[0].text;
        modifiedQuery = modifyQuery(query)
        return modifiedQuery
    } else {
        return null;
    }
}

module.exports = {
    queryExtractor
};
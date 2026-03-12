import sqlite3
import os

DATABASE = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'cases.db')

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS cases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_number TEXT NOT NULL,
            title TEXT NOT NULL,
            client_name TEXT NOT NULL,
            respondent_name TEXT NOT NULL,
            sample_type TEXT DEFAULT 'Type1',
            line_of_business TEXT DEFAULT 'Retail Banking',
            market TEXT DEFAULT 'US',
            region TEXT DEFAULT 'North America',
            client_response TEXT DEFAULT '',
            respondent_response TEXT DEFAULT '',
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    ''')

    # Add sample data if empty
    cursor = conn.execute('SELECT COUNT(*) FROM cases')
    if cursor.fetchone()[0] == 0:
        conn.execute('''
            INSERT INTO cases (case_number, title, client_name, respondent_name, sample_type, line_of_business, market, region, client_response, respondent_response, created_at, updated_at)
            VALUES 
            ('CTO/CTS/8317', 'Production deployment approval', 'Alice C.', 'Bob M.', 'Type1', 'Retail Banking', 'US', 'North America', 'Initial complaint submitted.', 'Investigation in progress.', '2026-03-09', '2026-03-12'),
            ('CTO/CTAS/8318', 'Database schema change request', 'John Smith.', 'Jane Doe', 'Type2', 'Investment Banking', 'UK', 'Europe', 'Schema change requested.', 'Under review.', '2026-03-10', '2026-03-11'),
            ('CTO/CTBS/8319', 'New third-party API investigation', 'Mary Johnson', 'Robert Brown', 'Type3', 'Wealth Management', 'Singapore', 'Asia Pacific', 'API integration needed.', 'Evaluating options.', '2026-03-08', '2026-03-12'),
            ('CTO/CTCS/8320', 'Security exception approval', 'David Wilson', 'Sarah Miller', 'Type1', 'Insurance', 'Canada', 'North America', 'Security exception needed.', 'Pending security review.', '2026-03-05', '2026-03-09'),
            ('CTO/CTCS/8321', 'Cost optimization experiment approval', 'Emily Davis', 'Michael Garcia', 'Type2', 'Retail Banking', 'Australia', 'Asia Pacific', 'Cost saving proposal.', 'Budget review in progress.', '2026-03-07', '2026-03-10'),
            ('CTO/CTS/8323', 'Feature rollout business sign-off', 'James Anderson', 'Lisa Thomas', 'Type1', 'Commercial Banking', 'Germany', 'Europe', 'New feature ready for rollout.', 'Awaiting business approval.', '2026-03-12', '2026-03-12'),
            ('CTO/CTS/8322', 'Production deployment approval', 'Emily Davis', 'Michael Garcia', 'Type3', 'Payment Services', 'US', 'North America', 'Deployment scheduled.', 'Approved for production.', '2026-03-06', '2026-03-11')
        ''')
    
    conn.commit()
    conn.close()

# Migration function to add new fields to existing database
def migrate_db():
    conn = get_db()
    
    # Get existing columns
    cursor = conn.execute("PRAGMA table_info(cases)")
    existing_columns = [row[1] for row in cursor.fetchall()]
    
    # Add new columns if they don't exist
    new_columns = {
        'sample_type': "ALTER TABLE cases ADD COLUMN sample_type TEXT DEFAULT 'Type1'",
        'line_of_business': "ALTER TABLE cases ADD COLUMN line_of_business TEXT DEFAULT 'Retail Banking'",
        'market': "ALTER TABLE cases ADD COLUMN market TEXT DEFAULT 'US'",
        'region': "ALTER TABLE cases ADD COLUMN region TEXT DEFAULT 'North America'",
        'client_response': "ALTER TABLE cases ADD COLUMN client_response TEXT DEFAULT ''",
        'respondent_response': "ALTER TABLE cases ADD COLUMN respondent_response TEXT DEFAULT ''"
    }
    
    for col, sql in new_columns.items():
        if col not in existing_columns:
            conn.execute(sql)
    
    # Generate mock data for existing cases if they don't have responses
    cursor = conn.execute("SELECT id, sample_type FROM cases WHERE client_response = '' OR client_response IS NULL")
    cases_needing_data = cursor.fetchall()
    
    mock_data = [
        ('Type1', 'Retail Banking', 'US', 'North America', 'Initial complaint submitted.', 'Investigation in progress.'),
        ('Type2', 'Investment Banking', 'UK', 'Europe', 'Schema change requested.', 'Under review.'),
        ('Type3', 'Wealth Management', 'Singapore', 'Asia Pacific', 'API integration needed.', 'Evaluating options.'),
        ('Type1', 'Insurance', 'Canada', 'North America', 'Security exception needed.', 'Pending security review.'),
        ('Type2', 'Retail Banking', 'Australia', 'Asia Pacific', 'Cost saving proposal.', 'Budget review in progress.'),
        ('Type3', 'Commercial Banking', 'Germany', 'Europe', 'New feature ready for rollout.', 'Awaiting business approval.'),
        ('Type1', 'Payment Services', 'US', 'North America', 'Deployment scheduled.', 'Approved for production.')
    ]
    
    for i, row in enumerate(cases_needing_data):
        case_id = row[0]
        mock = mock_data[i % len(mock_data)]
        conn.execute('''
            UPDATE cases 
            SET sample_type = ?, line_of_business = ?, market = ?, region = ?, 
                client_response = ?, respondent_response = ?
            WHERE id = ?
        ''', (mock[0], mock[1], mock[2], mock[3], mock[4], mock[5], case_id))
    
    conn.commit()
    conn.close()

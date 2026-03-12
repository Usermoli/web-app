from database.db import get_db

def get_all_cases(search=None):
    conn = get_db()
    if search:
        search_term = f'%{search}%'
        cursor = conn.execute('''
            SELECT * FROM cases 
            WHERE case_number LIKE ? 
            OR title LIKE ? 
            OR client_name LIKE ? 
            OR respondent_name LIKE ?
            ORDER BY created_at DESC
        ''', (search_term, search_term, search_term, search_term))
    else:
        cursor = conn.execute('SELECT * FROM cases ORDER BY created_at DESC')
    
    cases = []
    for row in cursor.fetchall():
        cases.append({
            'id': row['id'],
            'case_number': row['case_number'],
            'title': row['title'],
            'client_name': row['client_name'],
            'respondent_name': row['respondent_name'],
            'sample_type': row['sample_type'],
            'line_of_business': row['line_of_business'],
            'market': row['market'],
            'region': row['region'],
            'client_response': row['client_response'],
            'respondent_response': row['respondent_response'],
            'created_at': row['created_at'],
            'updated_at': row['updated_at']
        })
    conn.close()
    return cases

def get_case_by_id(case_id):
    conn = get_db()
    cursor = conn.execute('SELECT * FROM cases WHERE id = ?', (case_id,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return {
            'id': row['id'],
            'case_number': row['case_number'],
            'title': row['title'],
            'client_name': row['client_name'],
            'respondent_name': row['respondent_name'],
            'sample_type': row['sample_type'],
            'line_of_business': row['line_of_business'],
            'market': row['market'],
            'region': row['region'],
            'client_response': row['client_response'],
            'respondent_response': row['respondent_response'],
            'created_at': row['created_at'],
            'updated_at': row['updated_at']
        }
    return None

def create_case(case_number, title, client_name, respondent_name):
    from datetime import datetime
    conn = get_db()
    now = datetime.now().strftime('%Y-%m-%d')
    
    cursor = conn.execute('''
        INSERT INTO cases (case_number, title, client_name, respondent_name, sample_type, line_of_business, market, region, client_response, respondent_response, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (case_number, title, client_name, respondent_name, 'Type1', 'Retail Banking', 'US', 'North America', '', '', now, now))
    
    case_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return get_case_by_id(case_id)

def update_case(case_id, case_number, title, client_name, respondent_name, sample_type, line_of_business, market, region, client_response, respondent_response):
    from datetime import datetime
    conn = get_db()
    now = datetime.now().strftime('%Y-%m-%d')
    
    conn.execute('''
        UPDATE cases 
        SET case_number = ?, title = ?, client_name = ?, respondent_name = ?,
            sample_type = ?, line_of_business = ?, market = ?, region = ?,
            client_response = ?, respondent_response = ?, updated_at = ?
        WHERE id = ?
    ''', (case_number, title, client_name, respondent_name, sample_type, line_of_business, market, region, client_response, respondent_response, now, case_id))
    
    conn.commit()
    conn.close()
    
    return get_case_by_id(case_id)

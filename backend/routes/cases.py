from flask import Blueprint, request, jsonify
from models.case import get_all_cases, get_case_by_id, create_case, update_case

cases_bp = Blueprint('cases', __name__)

@cases_bp.route('/cases', methods=['GET'])
def get_cases():
    search = request.args.get('search', '')
    cases = get_all_cases(search if search else None)
    return jsonify(cases)

@cases_bp.route('/cases/<int:case_id>', methods=['GET'])
def get_case(case_id):
    case = get_case_by_id(case_id)
    if case:
        return jsonify(case)
    return jsonify({'error': 'Case not found'}), 404

@cases_bp.route('/cases', methods=['POST'])
def add_case():
    data = request.get_json()
    
    required_fields = ['case_number', 'title', 'client_name', 'respondent_name']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    new_case = create_case(
        data['case_number'],
        data['title'],
        data['client_name'],
        data['respondent_name']
    )
    
    return jsonify(new_case), 201

@cases_bp.route('/cases/<int:case_id>', methods=['PUT'])
def edit_case(case_id):
    data = request.get_json()
    
    # Check if case exists
    existing_case = get_case_by_id(case_id)
    if not existing_case:
        return jsonify({'error': 'Case not found'}), 404
    
    required_fields = ['case_number', 'title', 'client_name', 'respondent_name', 'sample_type', 'line_of_business', 'market', 'region', 'client_response', 'respondent_response']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    updated_case = update_case(
        case_id,
        data['case_number'],
        data['title'],
        data['client_name'],
        data['respondent_name'],
        data['sample_type'],
        data['line_of_business'],
        data['market'],
        data['region'],
        data['client_response'],
        data['respondent_response']
    )
    
    return jsonify(updated_case)

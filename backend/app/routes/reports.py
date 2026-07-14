from flask import Blueprint, jsonify, request, send_file
from app.services.report_service import generate_pdf_report, generate_excel_report

bp = Blueprint('reports', __name__)

@bp.route('/generate', methods=['POST'])
def generate():
    data = request.get_json(silent=True) or {}
    report_format = data.get('format', 'pdf').lower()
    if report_format not in ('pdf', 'excel'):
        return jsonify({"msg": "Format must be pdf or excel"}), 400
    if not data.get('date') or not isinstance(data.get('entries'), list):
        return jsonify({"msg": "Report date and entries are required"}), 400

    extension = 'xlsx' if report_format == 'excel' else 'pdf'
    filename = f"report_{data['date']}.{extension}"
    
    if report_format == 'pdf':
        path = generate_pdf_report(data, filename)
    else:
        path = generate_excel_report(data, filename)
        
    return send_file(path, as_attachment=True)

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from openpyxl import Workbook
import os

def generate_pdf_report(data, filename):
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter
    c.drawString(100, height - 100, "Energy Consumption Report")
    c.drawString(100, height - 120, f"Generated on: {data['date']}")
    
    y = height - 160
    for item in data['entries']:
        c.drawString(100, y, f"{item['name']}: {item['value']} kWh")
        y -= 20
        if y < 100:
            c.showPage()
            y = height - 100
            
    c.save()
    return filename

def generate_excel_report(data, filename):
    wb = Workbook()
    ws = wb.active
    ws.title = "Energy Usage"
    
    ws.append(["Name", "Value (kWh)"])
    for item in data['entries']:
        ws.append([item['name'], item['value']])
        
    wb.save(filename)
    return filename

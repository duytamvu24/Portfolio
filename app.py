# render, um richtige htmls zu rendern, also lesen zu können
from flask import Flask, render_template, request

# erstellt eine FLASK app instanz
app = Flask(__name__)

# wenn die Startseite aufgerufen wird, soll die funkton home angewendet werden
@app.route('/')
def home():
    return render_template('index.html')  # dein HTML

@app.route('/project/<name>')
def project(name):
    return render_template(f'{name}.html')

# Route reagiert auf "POST" Anfragen an /contact
@app.route('/contact', methods=['POST'])
def contact():
    name = request.form['name']
    email = request.form['email']
    message = request.form['message']
    print(name, email, message)
    return "Danke für deine Nachricht!"

if __name__ == '__main__':
    app.run(debug=True)
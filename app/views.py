from flask import render_template, flash, redirect, request
from app import app

@app.route('/')
@app.route('/index')
def index():
  return render_template("homepage/index.html")

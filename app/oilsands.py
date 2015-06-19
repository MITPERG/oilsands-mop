#!/usr/bin/env python

""" Oil Sands Simulation Algorithms """

__version__ = "1.0"
__author__  = "PERG"

import os
import pandas as pd
import numpy as np


class OilSands(object):

	def __init__(self):
		self.cost = cost


class Model(object):

	def __init__(self,price,wind_power,solar_power):
		self.price 				= price
		self.wind_power 	= wind_power
		self.solar_power 	= solar_power


	def create_cost_vector(self, bbl_price, reinvestment, turbine_power, panel_power):
		return np.vectorize(bbl_price, reinvestment, turbine_power, panel_power)

class Simulation(object):

	def __init__(self,model):
		self.model = model


class Optimization(object):

	def __init__(self,simulation):
		self.simulation = simulation






from flask import Flask
from flask import jsonify
from flask import request
from flask_cors import CORS
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.gaussian_process.kernels import RBF
import scipy.stats as st
import numpy as np
import math
import random

from bokeh.models import (
    GMapPlot, GMapOptions, ColumnDataSource, Circle, LogColorMapper, BasicTicker, ColorBar,
    Range1d, PanTool, WheelZoomTool, BoxSelectTool
)

from bokeh.models.mappers import ColorMapper, LinearColorMapper
from bokeh.palettes import Viridis5
from bokeh.plotting import figure, output_file, gmap, save
from bokeh.io import output_notebook, show # output_file
from bokeh.models import ColumnDataSource, GMapOptions

app = Flask(__name__)
CORS(app)


@app.route('/')
def main():
    return "It's Worked"


@app.route('/predict', methods=['POST'])
def predict():
    content = request.get_json()
    print(content)
    routes = content['routes']  # [[1.2, 4.5], [1.2, 4.5], [1.2, 4.5]]
    persona = content['persona']  # { "age": 17, weather: 1 }
    # persona = {
    #     'time': 10,
    #     'age': 17,
    #     'vehicle': 3,
    #     'weather': 3,
    #     'sex': 1
    # }
    result = crash_prob(routes, persona)  # [0.1, 0.5, 0.2]
    return jsonify(list(result))


coors = [(47.379666, 8.527691),  # Langstrasse
         (47.376403, 8.525685),
         (47.374296, 8.524151),
         (47.374810, 8.534485),  # Sihl lokal
         (47.405061, 8.504430),  # Honggerberg
         (47.372610, 8.550233),  # ETH
         (47.374630, 8.549761),
         (47.377972, 8.548173),
         (47.372298, 8.538367),  # Altstatt
         (47.372645, 8.528513),
         (47.391815, 8.517563),  # Technopark
         (47.389592, 8.512188),
         (47.423723, 8.572911),  # high way
         (47.344764, 8.519284),
         (47.425757, 8.493897)
         ]

# format: (time, weather(0:best, 4:worst), age, sex(1:male), vehicle, bias)
params = [(3.4, 1.2, -2.3, 0.5, 0.8, 0.),  # Langstrasse
          (3.4, 1.2, -2.3, 0.5, 0.8, 0.),
          (3.4, 1.2, -2.3, 0.5, 0.8, 0.),
          (3.4, 1.2, -2.3, 0.5, 0.8, 0.),  # Sihl lokal

          (0.1, 3.4, -2.3, 0.4, 1.1, 0.),  # Honggerberg
          (0.1, 3.4, -2.3, 0.4, 0.8, 0.),  # ETH
          (0.1, 3.4, -2.3, 0.4, 0.8, 0.),
          (0.1, 3.4, -2.3, 0.4, 0.8, 0.),
          (-0.9, 1.2, 2.3, 1.2, -0.8, 0.),  # Altstatt
          (-0.9, 1.2, 2.3, 1.2, -0.8, 0.),
          (-0.9, 1.2, 2.3, 1.2, -0.8, 0.),  # Technopark
          (-0.9, 1.2, 2.3, 1.2, -0.8, 0.),
          (-0.9, 1.2, 2.3, 1.2, 0.1, 0.),  # high way
          (-0.9, 1.2, 2.3, 1.2, 0.1, 0.),
          (-0.9, 1.2, 2.3, 1.2, 0.8, 0.)
          ]


def computer_crash_prob(xx, details, **kargs):

    def normalize_features(details):
        details_norm = {}
        details_norm['sex'] = details['sex']
        details_norm['time'] = details['time'] / 12 - 1
        details_norm['weather'] = details['weather'] / 2 - 2
        details_norm['age'] = details['age'] / 35 - 35
        details_norm['vehicle'] = details['vehicle'] / 2 - 2

        return details_norm

    def compute_label(details, f):
        # normalize the features:

        return 1 / (1 + math.exp(-details['time'] * f[0] +
                                 details['weather'] * f[1] +
                                 details['age'] * f[2] +
                                 details['sex'] * f[3] +
                                 details['vehicle'] * f[4] +
                                 f[5]))

    def compute_background(details):
        np.random.seed(int(details['age']) * 64 * 64 + int(details['weather']) * 32 +
                       int(details['vehicle']) * 64 + int(details['sex']))

        X = []
        y = []
        for i in range(100):
            xx = np.random.uniform(47.342, 47.469, 1)[0]
            yy = np.random.uniform(8.44, 8.57, 1)[0]

            X.append((xx, yy))
            y.append(np.random.random_sample() / 20 + 0.02)

        return X, y

    X, y = compute_background(details)
    details = normalize_features(details)

    labels = [compute_label(details, p) for p in params]
    X = X + coors
    y = y + labels

    # fit the GP regression model
    kernel = RBF()
    gp = GaussianProcessRegressor(kernel=kernel,
                                  n_restarts_optimizer=10)
    gp.fit(X, y)

    if kargs['return_cov'] == True:
        pred, var = gp.predict(xx, **kargs)
        pred = np.clip(a_min=0., a_max=100., a=pred)

        return pred, var
    else:
        return np.clip(a_min=0., a_max=100., a=gp.predict(xx, **kargs))


# use this function!!!
def crash_prob(xx, details, get_var=False):
    return computer_crash_prob(xx, details, return_cov=get_var)

@app.route('/get_html_plot', methods=['POST'])
def get_html_plot():
    content = request.get_json()
    print(content)
    x1 = content['x1']
    x2 = content['x2']
    y1 = content['y1']
    y2 = content['y2']
    persona = content['persona']  # { "age": 17, weather: 1 }
    # persona = {
    #     'time': 10,
    #     'age': 17,
    #     'vehicle': 3,
    #     'weather': 3,
    #     'sex': 1
    # }
    mesh = create_mesh(x1, x2, y1, y2)
    result_probs = crash_prob(mesh, persona)  # [0.1, 0.5, 0.2]
    plot_scatterplot_on_map((x1+x2)/2, (y1+y2)/2, mesh, result_probs)

def create_mesh(x1, x2, y1, y2, affinity=100):
    xx = np.linspace(x1, x2, affinity)
    yy = np.linspace(y1, y2, affinity)
    mesh = []
    for i in xx:
        for j in yy:
            mesh.append((i, j))
    return mesh

def prepare_data_for_plots(mesh, p):
    lats, lots = [], []
    for cor in mesh:
        lats.append(cor[0])
        lots.append(cor[1])

    source = ColumnDataSource(
        data=dict(
            lat=lats,
            lon=lots,
            color=p,
            size=[5]*len(lots)
        )
    )
    return source

def plot_scatterplot_on_map(lat, lng, mesh, result_probs):
    source = prepare_data_for_plots(mesh, result_probs)
    map_options = GMapOptions(lat=lat, lng=lng, map_type="roadmap", zoom=12)

    plot = GMapPlot(
        x_range=Range1d(), y_range=Range1d(), map_options=map_options
    )

    plot.api_key = "AIzaSyC7DtKqWoAtgKFmYtUu-PceyA7bV1Y9NTU"

    color_mapper = LinearColorMapper(palette=Viridis5)

    circle = Circle(x="lon", y="lat", size="size",
                    fill_color={'field': 'color', 'transform': color_mapper},
                    fill_alpha=0.5, line_color=None)
    plot.add_glyph(source, circle)

    color_bar = ColorBar(color_mapper=color_mapper,
                         ticker=BasicTicker(),
                         label_standoff=12,
                         border_line_color=None,
                         location=(0, 0))
    plot.add_layout(color_bar, 'right')

    plot.add_tools(PanTool(), WheelZoomTool(), BoxSelectTool())

    output_notebook()

    output_file("plot.html")
    save(plot)

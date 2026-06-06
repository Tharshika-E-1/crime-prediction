from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from sklearn.cluster import DBSCAN
import os


# ---------------------------------
# Load Dataset
# ---------------------------------

data = pd.read_csv("crime_data.csv")
print("Total dataset rows:", len(data))



# ---------------------------------
# Flask Setup
# ---------------------------------

app = Flask(__name__)
CORS(app)
@app.route("/")
def home():
    return "CRIMORA Backend Running"

@app.route("/api/crimes")
def get_crimes():
    df = data.head(200)
    return df.to_json(orient="records")

# ---------------------------------
# Dashboard API
# ---------------------------------

@app.route("/api/dashboard")
def dashboard():

    df = data.copy()

    total_crimes = len(df)

    crime_types = df["Primary Type"].value_counts()

    most_common_crime = crime_types.idxmax()

    high_risk = df[df["Primary Type"].isin(["BATTERY","ASSAULT"])].shape[0]
    medium_risk = df[df["Primary Type"].isin(["ROBBERY","BURGLARY"])].shape[0]
    low_risk = total_crimes - (high_risk + medium_risk)

    top_crimes = crime_types.head(5).to_dict()

    return jsonify({
        "total_crimes": int(total_crimes),
        "high_risk": int(high_risk),
        "medium_risk": int(medium_risk),
        "low_risk": int(low_risk),
        "most_common_crime": most_common_crime,
        "top_crimes": top_crimes
    })


# ---------------------------------
# Analytics API
# ---------------------------------

@app.route("/api/analytics")
def analytics():

    df = data.head(5000).copy()

    crime_distribution = df["Primary Type"].value_counts().head(6).to_dict()

    df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
    df["Month"] = df["Date"].dt.strftime("%b")

    monthly_trend = df.groupby("Month").size().to_dict()

    return jsonify({
        "crime_distribution": crime_distribution,
        "monthly_trend": monthly_trend
    })


# ---------------------------------
# Hotspots Detection API
# ---------------------------------

@app.route("/api/hotspots")
def hotspots():

    df = data[["Latitude","Longitude"]].dropna().head(5000)

    coords = df.values

    db = DBSCAN(eps=0.01, min_samples=20).fit(coords)

    df["cluster"] = db.labels_

    hotspots = []

    for cluster_id in set(db.labels_):

        if cluster_id == -1:
            continue

        cluster_points = df[df["cluster"] == cluster_id]

        center_lat = cluster_points["Latitude"].mean()
        center_lng = cluster_points["Longitude"].mean()

        hotspots.append({
            "latitude": float(center_lat),
            "longitude": float(center_lng),
            "crime_count": int(len(cluster_points))
        })

    return jsonify(hotspots)


# ---------------------------------
# Crime Prediction API
# ---------------------------------

@app.route("/api/predict", methods=["POST"])
def predict():

    data_req = request.json

    lat = data_req.get("latitude")
    lng = data_req.get("longitude")

    # Dummy AI logic for demo
    risk_level = "High"

    return jsonify({
        "latitude": lat,
        "longitude": lng,
        "risk_level": risk_level
    })


# ---------------------------------
# Admin Statistics
# ---------------------------------

@app.route("/api/admin/stats")
def admin_stats():

    total_crimes = len(data)

    crime_types = data["Primary Type"].value_counts().head(5).to_dict()

    return jsonify({
        "total_crimes": int(total_crimes),
        "top_crimes": crime_types
    })


# ---------------------------------
# Recent Crimes for Admin
# ---------------------------------

@app.route("/api/admin/recent-crimes")
def admin_recent():

    df = data[["Primary Type","Date","Latitude","Longitude"]].dropna().head(10)

    df["Date"] = pd.to_datetime(df["Date"])
    df["Time"] = df["Date"].dt.strftime("%H:%M")
    df["Date"] = df["Date"].dt.strftime("%Y-%m-%d")

    crimes = df.to_dict(orient="records")

    return jsonify(crimes)


# ---------------------------------
# Run Server
# ---------------------------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

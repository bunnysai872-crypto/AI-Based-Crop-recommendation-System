import pickle

model = pickle.load(open("crop_model.pkl", "rb"))

samples = [
    [90, 42, 43, 20.8, 82.0, 6.5, 202.9],   # Example 1
    [20, 20, 20, 35.0, 40.0, 5.5, 50.0],    # Example 2
    [120, 60, 60, 28.0, 90.0, 7.2, 300.0],  # Example 3
    [50, 25, 25, 30.0, 55.0, 6.0, 100.0],   # Example 4
]

for sample in samples:
    print(sample, "->", model.predict([sample])[0])
#!/usr/bin/env python
# sklearn.__version__ == '1.0.2'

from sklearn.impute import SimpleImputer
import numpy as np

data = pd.DataFrame([2,np.NaN,2,2,2,3,np.NaN])
imputer = SimpleImputer(missing_values=np.NaN, strategy="mean", copy=False)
data = pd.DataFrame(imputer.fit_transform(data[[0]]))
if np.sum(data.isna())==0:
	print("Succeed!")

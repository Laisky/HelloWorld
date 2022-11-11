#!/usr/bin/env python
# pandas.__version__ == '1.4.2'

import pandas as pd

print("run...")

data = pd.DataFrame([[1,2,3,4],[2,3,4,5]])
data_test = pd.concat([data, data])
if data_test.shape == (4,4):
	print("Succeed!")

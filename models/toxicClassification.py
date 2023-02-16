from detoxify import Detoxify
import pandas as pd

inputText = 'I hated your lecture'
results = Detoxify('original').predict(inputText)
print(pd.DataFrame(results, index=inputText).round(5))

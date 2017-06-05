import pandas as pd

# Read data
df_wants = pd.read_csv("wants.csv", index_col = False)
df_promos = pd.read_csv("promos.csv")

# Clean data
df_wants['Count'] = df_wants['    Count']
df_promos['PucaID'] = df_promos['PucaID'].apply(lambda x: int(x.split("/")[-1]))
df_promos['Foil'] = df_promos['Foil'].apply(lambda x: 1 if x == "foilfoilfoil" else 0)

# Special transformations for Cardsphere
set_map = {"Masterpiece Series: Amonkhet Invocations": "Amonkhet Invocations",
			"Masterpiece Series: Kaladesh Inventions": "Kaladesh Inventions"}

#df_wants['Foil'] = df_wants['Foil'].apply(lambda x: 1 if x['Expansion'] == "Masterpiece Series: Amonkhet Invocations" else x['Foil'], axis=1)
df_wants['Expansion'] = df_wants['Expansion'].apply(lambda x: set_map[x] if x in set_map.keys() else x)

# Remove promoted rows
def promo_match(x):
	if x['Count'] > 1:
		return 0
	match_idx = []
	match_idx = df_promos[(df_promos['PucaID'] == x['PucaID']) & (df_promos['Foil'] == x['Foil']) & (df_promos['Count'] > 0)].index.tolist()
	if len(match_idx) > 1:
		print(x)
		raw_input("Too many rows??")
		return 0
	if len(match_idx) == 0:
		return 0
	q = df_promos.get_value(match_idx[0],"Count")
	df_promos.set_value(match_idx[0],"Count",q-1)
 	return 1

df_wants['Promo'] = df_wants.apply(promo_match, axis=1)

print(df_wants)

df_wants[df_wants['Promo'] == 0].to_csv("wants_scrubbed.csv")
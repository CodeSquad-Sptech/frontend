
import pandas

# Lê os dados do CSV e guarda como lista
tabela = pandas.read_csv("teste.csv", sep=";")

# Salva a tabela em um arquivo Excel e remove o índice adicional (index=False)
tabela.to_excel("teste.xlsx", index=False)

print("Conversão concluída!")




#pip install pandas openpyxl
#python conversor.py
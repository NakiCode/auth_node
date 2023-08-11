import os

def createFolder(name):
    try:
        # Spécifiez le chemin du bureau
        path = os.path.join(os.path.expanduser("~"), "Desktop")
        # Chemin complet du nouveau dossier
        newPath = os.path.join(path, name)
        # Vérifiez si le dossier n'existe pas déjà
        if not os.path.exists(newPath):
            # Créez le dossier
            os.makedirs(newPath)
            return print("Le dossier a été créé avec succès.")
        else:
            return print("Le dossier existe déjà sur le bureau.")
    except:
        print("Problème de creation du dossier")

if __name__ == 'main':
    resultat = createFolder(name="nakicode")
    print(resultat)



    

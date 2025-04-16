git add .

# Verifica se há arquivos prontos para commit
if (git diff --cached --quiet) {
    Write-Host "Nenhuma alteração para commit."
} else {
    $mensagem = Read-Host "Digite a mensagem do commit"
    git commit -m "$mensagem"
    git push origin main
}

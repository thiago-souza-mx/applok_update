
function SetVariables
{
    $global:path = 'C:\Program Files\applok_update\'
    $global:app_name = 'applok_update'
}



function GetPID {
    Try{
        $proc = Get-Process  -Name $global:app_name -ErrorAction Stop
        $proc.Id
    }
    Catch
    {
        Write-Host 'sem processo'
        try {Start-Process -FilePath "$global:path$global:app_name.exe" }
        catch 
        {
            WriteLog "Erro para iniciar o arquivo"
            WriteLog $_.Exception.Message
        }
    }
}

function Main{
    SetVariables
    GetPID
}

Main
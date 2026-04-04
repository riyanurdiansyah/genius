#!/bin/bash

# Install the current directory as a new dotnet project template
echo "Installing Kuda Admin Custom Template..."
dotnet new install .

echo ""
echo "Template installed successfully!"
echo "To create a new project based on this template, use:"
echo "    dotnet new mvccustom -n YourNewProjectName"
echo ""

BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$BRANCH" != "master" ]]; then
  echo 'Please merge with master and push before deploying github pages. You can push only from master branch.';
  exit 1;
fi

read -p "Did you test your changes? Are you sure you want to push? [y/n]" -n 1 -r
echo    
if [[ $REPLY =~ ^[Yy]$ ]]
then
    git subtree push --prefix dist origin gh-pages
fi
echo "Done. Make sure live page still works!"